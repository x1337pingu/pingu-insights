import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'

import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { home } from './home'
import { imageWim } from './image-wim'
import { imageWhyPingu } from './image-why-pingu'
import { imageHero1 } from './image-hero-1'
import { postWimW06 } from './post-wim-w06'
import { postWhyPingu } from './post-why-pingu'

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'posts',
  'forms',
  'form-submissions',
  'search',
]

const globals: GlobalSlug[] = ['header', 'footer']

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  payload.logger.info(`— Clearing collections and globals...`)

  // clear the database (sequential to avoid write conflicts)
  for (const global of globals) {
    await payload.updateGlobal({
      slug: global,
      data: {
        navItems: [],
      } as any,
      depth: 0,
      context: {
        disableRevalidate: true,
      },
    })
  }

  for (const collection of collections) {
    await payload.db.deleteMany({ collection, req, where: {} })
  }

  for (const collection of collections) {
    if (payload.collections[collection].config.versions) {
      await payload.db.deleteVersions({ collection, req, where: {} })
    }
  }

  payload.logger.info(`— Seeding author...`)

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        equals: 'demo-author@example.com',
      },
    },
  })

  payload.logger.info(`— Seeding media...`)

  const [wimImageBuffer, pinguImageBuffer, heroBuffer] = await Promise.all([
    fetchFileByURL(
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1920&q=80&fm=jpg',
      'wim-hero.jpg',
    ),
    fetchFileByURL(
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920&q=80&fm=jpg',
      'pingu-hero.jpg',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-hero1.webp',
    ),
  ])

  // Create categories
  const categoryData = [
    { title: 'Week in Markets', slug: 'week-in-markets', color: '#29B6F6' },
    { title: 'Knowledge Base', slug: 'knowledge-base', color: '#72FFA6' },
    { title: 'Chart Check', slug: 'chart-check', color: '#FFB74D' },
    { title: 'Announcements', slug: 'announcements', color: '#FF99D2' },
  ]

  const categoryDocs = await Promise.all(
    categoryData.map((cat) =>
      payload.create({
        collection: 'categories',
        data: cat,
      }),
    ),
  )

  const wimCategory = categoryDocs.find((c) => c.slug === 'week-in-markets')
  const kbCategory = categoryDocs.find((c) => c.slug === 'knowledge-base')

  const [demoAuthor, wimImageDoc, pinguImageDoc, homeImageDoc] = await Promise.all([
    payload.create({
      collection: 'users',
      data: {
        name: 'Pingu Research',
        email: 'demo-author@example.com',
        password: 'password',
      } as any,
    }),
    payload.create({
      collection: 'media',
      data: imageWim,
      file: wimImageBuffer,
    }),
    payload.create({
      collection: 'media',
      data: imageWhyPingu,
      file: pinguImageBuffer,
    }),
    payload.create({
      collection: 'media',
      data: imageHero1,
      file: heroBuffer,
    }),
  ])

  payload.logger.info(`— Seeding posts...`)

  // Create posts in order (oldest first)
  const whyPinguDoc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: { disableRevalidate: true },
    data: {
      ...postWhyPingu({ heroImage: pinguImageDoc, author: demoAuthor }),
      categories: kbCategory ? [kbCategory.id] : [],
    } as any,
  })

  const wimDoc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: { disableRevalidate: true },
    data: {
      ...postWimW06({ heroImage: wimImageDoc, author: demoAuthor }),
      categories: wimCategory ? [wimCategory.id] : [],
    } as any,
  })

  // Link related posts
  await payload.update({
    id: whyPinguDoc.id,
    collection: 'posts',
    data: { relatedPosts: [wimDoc.id] },
    context: { disableRevalidate: true },
  })
  await payload.update({
    id: wimDoc.id,
    collection: 'posts',
    data: { relatedPosts: [whyPinguDoc.id] },
    context: { disableRevalidate: true },
  })

  payload.logger.info(`— Seeding contact form...`)

  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: contactFormData,
  })

  payload.logger.info(`— Seeding pages...`)

  const [_, contactPage] = await Promise.all([
    payload.create({
      collection: 'pages',
      depth: 0,
      context: { disableRevalidate: true },
      data: home({ heroImage: homeImageDoc, metaImage: wimImageDoc }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      context: { disableRevalidate: true },
      data: contactPageData({ contactForm: contactForm }),
    }),
  ])

  payload.logger.info(`— Seeding globals...`)

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      context: { disableRevalidate: true },
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Posts',
              url: '/posts',
            },
          },
          {
            link: {
              type: 'reference',
              label: 'Contact',
              reference: {
                relationTo: 'pages',
                value: contactPage.id,
              },
            },
          },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      context: { disableRevalidate: true },
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Admin',
              url: '/admin',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Pingu Exchange',
              newTab: true,
              url: 'https://pingu.exchange',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Telegram',
              newTab: true,
              url: 'https://t.me/PinguExchange',
            },
          },
        ],
      },
    }),
  ])

  payload.logger.info('Seeded database successfully!')
}

async function fetchFileByURL(url: string, filename?: string): Promise<File> {
  const res = await fetch(url, {
    credentials: 'include',
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
  }

  const data = await res.arrayBuffer()
  const contentType = res.headers.get('content-type') || 'image/jpeg'
  const name = filename || url.split('/').pop()?.split('?')[0] || `file-${Date.now()}`

  return {
    name,
    data: Buffer.from(data),
    mimetype: contentType,
    size: data.byteLength,
  }
}
