import type { CollectionAfterChangeHook } from 'payload'
import type { Post } from '../../../payload-types'

export const notifyTelegram: CollectionAfterChangeHook<Post> = async ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const channelId = process.env.TELEGRAM_CHANNEL_ID

  if (!botToken || !channelId) return doc

  const justPublished =
    doc._status === 'published' && previousDoc?._status !== 'published'

  if (!justPublished) return doc

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://blog.pingu.exchange'
  const postUrl = `${baseUrl}/posts/${doc.slug}`

  const highlights = extractHeadings(doc.content)
  const bulletPoints = highlights
    .slice(0, 5)
    .map((h) => `\\u2022 ${escapeMarkdownV2(h)}`)
    .join('\n')

  const lines = [
    `New from Pingu Insights`,
    ``,
    `*${escapeMarkdownV2(doc.title)}*`,
  ]

  if (bulletPoints) {
    lines.push(``, `Key highlights:`, bulletPoints)
  } else if ((doc as any).excerpt) {
    lines.push(``, escapeMarkdownV2((doc as any).excerpt))
  }

  const message = lines.join('\n')

  const inlineKeyboard = {
    inline_keyboard: [
      [
        {
          text: 'Read Full Article \u2192',
          url: postUrl,
        },
      ],
      [
        {
          text: 'Trade on Pingu \u26A1',
          url: 'https://pingu.exchange/trade/BTC-USD',
        },
      ],
    ],
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: channelId,
        text: message,
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: false,
        reply_markup: inlineKeyboard,
      }),
    })

    const result = await response.json()

    if (!result.ok) {
      payload.logger.error(`Telegram API error: ${result.description}`)
    } else {
      payload.logger.info(`Telegram notification sent for post: ${doc.title}`)
    }
  } catch (error) {
    payload.logger.error(`Failed to send Telegram notification: ${error}`)
  }

  return doc
}

/**
 * Extract H2 heading text from Lexical JSON content.
 */
function extractHeadings(content: any): string[] {
  const headings: string[] = []
  if (!content?.root?.children) return headings

  for (const node of content.root.children) {
    if (node.type === 'heading' && node.tag === 'h2') {
      const text = extractTextFromNode(node)
      if (text) headings.push(text)
    }
  }

  return headings
}

/**
 * Recursively extract plain text from a Lexical node.
 */
function extractTextFromNode(node: any): string {
  if (node.type === 'text' && typeof node.text === 'string') {
    return node.text
  }
  if (Array.isArray(node.children)) {
    return node.children.map(extractTextFromNode).join('')
  }
  return ''
}

/**
 * Escape special characters for Telegram MarkdownV2.
 * See: https://core.telegram.org/bots/api#markdownv2-style
 */
function escapeMarkdownV2(text: string): string {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, '\\$1')
}
