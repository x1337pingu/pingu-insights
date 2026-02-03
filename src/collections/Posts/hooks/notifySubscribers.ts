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

    const emails = subscribers.docs.map((sub: any) => sub.email)
    const excerpt = (doc as any).excerpt || ''

    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)

    await resend.emails.send({
      from: 'Pingu Blog <blog@pingu.exchange>',
      to: emails,
      subject: doc.title,
      html: `
        <div style="background-color: #0a0a0a; color: #E9E9EE; font-family: sans-serif; padding: 40px 20px; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h2 style="color: #9051F4; margin: 0;">Pingu Blog</h2>
          </div>
          <h1 style="color: #FFFFFF; font-size: 24px; margin-bottom: 16px;">${doc.title}</h1>
          ${excerpt ? `<p style="color: #8D8DC0; font-size: 16px; line-height: 1.6;">${excerpt}</p>` : ''}
          <a href="${postUrl}" style="display: inline-block; background-color: #9051F4; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 24px; font-weight: 600;">Read Article</a>
          <hr style="border: none; border-top: 1px solid #571F83; margin: 32px 0;" />
          <p style="color: #8D8DC0; font-size: 12px; text-align: center;">
            You are receiving this because you subscribed to Pingu Blog updates.
          </p>
        </div>
      `,
    })

    payload.logger.info(`Newsletter sent to ${emails.length} subscribers for: ${doc.title}`)
  } catch (error) {
    payload.logger.error(`Failed to send newsletter: ${error}`)
  }

  return doc
}
