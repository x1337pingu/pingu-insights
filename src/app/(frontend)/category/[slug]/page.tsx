import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'

import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import { getServerSideURL } from '@/utilities/getURL'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const categories = await payload.find({
    collection: 'categories',
    overrideAccess: true,
    limit: 100,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return categories.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function CategoryPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const category = await queryCategoryBySlug({ slug: decodedSlug })

  if (!category) {
    return (
      <div className="container py-16">
        <h1 className="text-3xl font-bold text-white">Category not found</h1>
      </div>
    )
  }

  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    where: {
      categories: {
        contains: category.id,
      },
      _status: {
        equals: 'published',
      },
    },
    sort: '-publishedAt',
  })

  return (
    <div className="pt-16 pb-16">
      <div className="container mb-12">
        <div className="flex items-center gap-3 mb-4">
          {(category as any).color && (
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: (category as any).color }}
            />
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-white">{category.title}</h1>
        </div>
        {(category as any).description && (
          <p className="text-[#8D8DC0] text-lg max-w-2xl">{(category as any).description}</p>
        )}
      </div>

      <CollectionArchive posts={posts.docs as any} />

      {posts.totalPages > 1 && (
        <div className="container mt-12">
          <Pagination page={posts.page!} totalPages={posts.totalPages} />
        </div>
      )}
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const category = await queryCategoryBySlug({ slug: decodedSlug })

  return {
    title: category ? `${category.title} | Pingu Blog` : 'Category | Pingu Blog',
    description: category ? (category as any).description || `Articles in ${category.title}` : '',
    openGraph: {
      title: category?.title || 'Category',
      url: `${getServerSideURL()}/category/${slug}`,
    },
  }
}

const queryCategoryBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'categories',
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
