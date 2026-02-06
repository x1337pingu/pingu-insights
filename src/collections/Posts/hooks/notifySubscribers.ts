import type { CollectionAfterChangeHook } from 'payload'
import type { Post } from '../../../payload-types'

export const notifySubscribers: CollectionAfterChangeHook<Post> = async ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return doc

  const justPublished =
    doc._status === 'published' && previousDoc?._status !== 'published'

  if (!justPublished) return doc

  try {
    const subscribers = await payload.find({
      collection: 'subscribers' as any,
      where: {
        status: { equals: 'active' },
      },
      limit: 0,
      pagination: false,
    })

    if (!subscribers.docs.length) return doc

    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://blog.pingu.exchange'
    const postUrl = `${baseUrl}/posts/${doc.slug}`
    const excerpt = (doc as any).excerpt || ''

    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)

    // Send individual emails with personalized unsubscribe links
    for (const sub of subscribers.docs) {
      const subscriber = sub as any
      const unsubscribeToken = Buffer.from(subscriber.email).toString('base64')
      const unsubscribeUrl = `${baseUrl}/unsubscribe?token=${unsubscribeToken}`

      const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this week's market insights from @PinguExchange`)}&url=${encodeURIComponent(postUrl)}`

      await resend.emails.send({
        from: 'Pingu Insights <insights@pingu.exchange>',
        to: subscriber.email,
        subject: `New: ${doc.title}`,
        html: generateEmailHtml({
          title: doc.title,
          excerpt,
          postUrl,
          twitterShareUrl,
          unsubscribeUrl,
        }),
      })
    }

    payload.logger.info(`Newsletter sent to ${subscribers.docs.length} subscribers for: ${doc.title}`)
  } catch (error) {
    payload.logger.error(`Failed to send newsletter: ${error}`)
  }

  return doc
}

function generateEmailHtml({
  title,
  excerpt,
  postUrl,
  twitterShareUrl,
  unsubscribeUrl,
}: {
  title: string
  excerpt: string
  postUrl: string
  twitterShareUrl: string
  unsubscribeUrl: string
}) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; background-image: url(https://insights.pingu.exchange/grid-pattern.png); background-repeat: repeat;">
    <tr>
      <td align="center" style="background: linear-gradient(180deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.8) 60%, rgba(50,15,70,0.6) 80%, rgba(144,81,244,0.3) 100%); padding: 48px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px;">

          <!-- Decorative top element -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <div style="width: 80px; height: 4px; background: linear-gradient(90deg, #9051F4, #72FFA6); border-radius: 2px;"></div>
            </td>
          </tr>

          <!-- Logo section -->
          <tr>
            <td style="padding-bottom: 40px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <img src="https://insights.pingu.exchange/logo-white.svg" alt="Pingu" width="100" style="display: block;"/>
                  </td>
                  <td align="right">
                    <span style="color: #72FFA6; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">Insights</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: rgba(15,8,25,0.85); border: 1px solid rgba(144,81,244,0.2); border-radius: 16px;">
                <tr>
                  <td style="padding: 36px 32px;">
                    <!-- Badge -->
                    <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                      <tr>
                        <td style="background: rgba(114,255,166,0.1); border: 1px solid rgba(114,255,166,0.25); border-radius: 20px; padding: 6px 14px;">
                          <span style="color: #72FFA6; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;">New Article</span>
                        </td>
                      </tr>
                    </table>

                    <!-- Title -->
                    <h1 style="margin: 0 0 16px 0; color: #FFFFFF; font-size: 26px; font-weight: 700; line-height: 1.25;">${title}</h1>

                    <!-- Excerpt -->
                    ${excerpt ? `<p style="margin: 0 0 28px 0; color: #B8B8C8; font-size: 15px; line-height: 1.7;">${excerpt}</p>` : ''}

                    <!-- CTA Button -->
                    <a href="${postUrl}" style="display: inline-block; background: linear-gradient(135deg, #9051F4 0%, #7B3FD9 100%); color: #FFFFFF; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">Read Article</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Share Newsletter section -->
          <tr>
            <td style="padding-top: 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: rgba(114,255,166,0.04); border: 1px solid rgba(114,255,166,0.12); border-radius: 12px;">
                <tr>
                  <td style="padding: 18px 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td>
                          <p style="margin: 0; color: #B8B8C8; font-size: 13px;">Enjoyed this? Share it with your network.</p>
                        </td>
                        <td align="right" style="padding-left: 16px;">
                          <a href="${twitterShareUrl}" style="display: inline-block; color: #72FFA6; padding: 8px 14px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 12px; border: 1px solid rgba(114,255,166,0.3);">Share on X</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Referral section -->
          <tr>
            <td style="padding-top: 12px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: rgba(144,81,244,0.06); border: 1px solid rgba(144,81,244,0.15); border-radius: 12px;">
                <tr>
                  <td style="padding: 18px 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td>
                          <p style="margin: 0 0 4px 0; color: #FFFFFF; font-size: 14px; font-weight: 600;">Refer traders. Earn up to 20% of their fees.</p>
                          <p style="margin: 0; color: #8D8DC0; font-size: 13px;">Get your referral link and start earning rebates.</p>
                        </td>
                        <td align="right" style="padding-left: 16px;">
                          <a href="https://pingu.exchange/referral" style="display: inline-block; background: transparent; color: #9051F4; padding: 10px 16px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 13px; border: 1px solid rgba(144,81,244,0.4);">Get Link</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Spacer -->
          <tr>
            <td style="height: 40px;"></td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 0 12px;"><a href="https://pingu.exchange" style="color: #6B6B80; text-decoration: none; font-size: 12px;">pingu.exchange</a></td>
                  <td style="color: #3D3D50;">&bull;</td>
                  <td style="padding: 0 12px;"><a href="https://x.com/PinguExchange" style="color: #6B6B80; text-decoration: none; font-size: 12px;">X</a></td>
                  <td style="color: #3D3D50;">&bull;</td>
                  <td style="padding: 0 12px;"><a href="https://t.me/pinguinsights" style="color: #6B6B80; text-decoration: none; font-size: 12px;">Telegram</a></td>
                  <td style="color: #3D3D50;">&bull;</td>
                  <td style="padding: 0 12px;"><a href="https://discord.gg/pinguexchange" style="color: #6B6B80; text-decoration: none; font-size: 12px;">Discord</a></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Tagline -->
          <tr>
            <td align="center" style="padding-top: 20px;">
              <p style="margin: 0; color: #4A4A5C; font-size: 11px; letter-spacing: 0.5px;">Market insights by Pingu &bull; On-chain perpetuals on Monad</p>
            </td>
          </tr>

          <!-- Unsubscribe -->
          <tr>
            <td align="center" style="padding-top: 16px;">
              <a href="${unsubscribeUrl}" style="color: #3D3D50; text-decoration: underline; font-size: 11px;">Unsubscribe</a>
            </td>
          </tr>

          <!-- Decorative bottom element -->
          <tr>
            <td align="center" style="padding-top: 24px;">
              <div style="width: 40px; height: 2px; background: linear-gradient(90deg, transparent, #571F83, transparent); border-radius: 1px;"></div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
