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
      from: 'Pingu Insights <insights@pingu.exchange>',
      to: emails,
      subject: `New: ${doc.title}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px;">

          <!-- Header with Logo -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <svg width="120" height="25" viewBox="0 0 2000 409" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M112.352 244.978C113.199 243.48 112.874 241.655 111.636 240.483C87.0725 217.223 81.6647 187.838 88.3756 157.802C94.8911 128.417 114.568 103.267 153.856 93.4291C182.654 86.2621 216.143 93.3639 237.579 114.539C254.715 131.479 264.879 151.612 264.358 179.107C263.837 203.866 253.933 224.585 235.755 242.568C213.407 264.59 180.178 271.887 150.468 263.287C148.839 262.831 147.145 263.482 146.298 264.916L106.814 332.676C104.795 336.195 104.86 336.39 108.573 337.954C143.952 352.613 180.96 355.089 218.815 345.056C256.67 335.022 291.592 311.371 315.243 279.184C343.716 240.352 354.075 196.569 346.322 149.136C338.569 101.704 314.071 63.1323 277.128 36.2235C236.472 6.57822 191.124 -3.19494 142.584 5.60091C101.472 13.0285 67.4611 33.3567 40.6826 65.4127C13.9041 97.4687 0.351989 138.32 0.22168 179.954V391.836C0.22168 393.074 0.22168 394.312 0.286834 395.55C0.873224 401.87 5.75981 406.301 12.1449 406.496C18.8558 406.757 22.0484 402.326 24.9804 397.375L112.418 245.043L112.352 244.978Z" fill="white"/>
                      <path d="M175.097 219.307C195.14 219.307 211.388 201.163 211.388 178.781C211.388 156.399 195.14 138.255 175.097 138.255C155.054 138.255 138.806 156.399 138.806 178.781C138.806 201.163 155.054 219.307 175.097 219.307Z" fill="white"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M621.956 70.7695H429.62L372.87 337.772H493.601L506.958 275.289H580.061C669.974 275.289 731.676 243.689 731.676 161.008C731.676 110.383 699.294 70.7695 621.956 70.7695ZM606.775 172.41C606.775 197.951 586.186 208.245 556.475 208.245H521.096L534.453 145.371H573.285C595.372 145.371 606.775 156.773 606.775 172.41Z" fill="white"/>
                      <path d="M781.91 70.7695H902.641L845.891 337.772H725.16L781.91 70.7695Z" fill="white"/>
                      <path d="M1093.41 71.1611H946.034L889.284 337.773H992.098L1024.09 187.331L1070.15 337.773H1214.47L1271.22 71.1611H1168.8L1136.81 220.495L1093.41 71.1611Z" fill="white"/>
                      <path d="M1275.91 217.042C1275.91 112.665 1366.93 62.04 1486.16 62.04C1539.13 62.04 1581.74 73.833 1619.08 90.5777L1602.72 169.415C1577.97 158.338 1543.69 149.999 1503.69 149.999C1441.21 149.999 1400.88 172.477 1400.88 215.87C1400.88 242.127 1421.07 262.325 1454.17 262.325C1484.66 262.325 1504.47 253.594 1514.7 238.348H1428.24L1445.38 177.038H1630.09L1621.36 218.541C1602.72 306.499 1539.85 346.895 1438.93 346.895C1338 346.895 1275.91 285.976 1275.91 217.042Z" fill="white"/>
                      <path d="M1653.35 201.796C1651.01 212.807 1649.9 223.101 1649.9 233.005L1650.03 233.07C1650.03 304.284 1705.67 346.96 1788.68 346.96C1888.04 346.96 1948.24 300.44 1965.38 220.104L1996.97 71.1611H1876.63L1845.75 215.152C1840.41 241.475 1826.66 255.157 1802.68 255.157C1782.49 255.157 1770.3 243.364 1770.3 223.557C1770.3 219.322 1770.63 215.152 1771.8 210.592L1801.51 71.1611H1681.17L1653.35 201.796Z" fill="white"/>
                    </svg>
                  </td>
                  <td align="right">
                    <span style="color: #8D8DC0; font-size: 13px; letter-spacing: 0.5px;">INSIGHTS</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding-bottom: 32px;">
              <div style="height: 1px; background: linear-gradient(90deg, #9051F4 0%, #571F83 50%, transparent 100%);"></div>
            </td>
          </tr>

          <!-- New Article Label -->
          <tr>
            <td style="padding-bottom: 12px;">
              <span style="color: #72FFA6; font-size: 12px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;">New Article</span>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td style="padding-bottom: 20px;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 28px; font-weight: 600; line-height: 1.3;">${doc.title}</h1>
            </td>
          </tr>

          <!-- Excerpt -->
          ${excerpt ? `
          <tr>
            <td style="padding-bottom: 28px;">
              <p style="margin: 0; color: #D5D5DA; font-size: 16px; line-height: 1.65;">${excerpt}</p>
            </td>
          </tr>
          ` : ''}

          <!-- CTA Button -->
          <tr>
            <td style="padding-bottom: 48px;">
              <a href="${postUrl}" style="display: inline-block; background-color: #9051F4; color: #FFFFFF; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">Read Article</a>
            </td>
          </tr>

          <!-- Footer Divider -->
          <tr>
            <td style="padding-bottom: 24px;">
              <div style="height: 1px; background-color: #28012E;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding-bottom: 16px;">
                    <a href="https://pingu.exchange" style="color: #8D8DC0; text-decoration: none; font-size: 13px; margin-right: 20px;">pingu.exchange</a>
                    <a href="https://x.com/PinguExchange" style="color: #8D8DC0; text-decoration: none; font-size: 13px; margin-right: 20px;">X</a>
                    <a href="https://t.me/paboricua" style="color: #8D8DC0; text-decoration: none; font-size: 13px; margin-right: 20px;">Telegram</a>
                    <a href="https://discord.gg/qjvDRESSBM" style="color: #8D8DC0; text-decoration: none; font-size: 13px;">Discord</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin: 0; color: #571F83; font-size: 12px;">
                      Market intelligence by Pingu. Decentralized perpetuals on Monad.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    })

    payload.logger.info(`Newsletter sent to ${emails.length} subscribers for: ${doc.title}`)
  } catch (error) {
    payload.logger.error(`Failed to send newsletter: ${error}`)
  }

  return doc
}
