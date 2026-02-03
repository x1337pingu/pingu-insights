import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: true,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      excerpt: true,
    },
    sort: '-publishedAt',
  })

  return (
    <div className="pt-16 pb-24">
      <PageClient />
      <div className="container mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">All Articles</h1>
        <p className="text-[#8D8DC0]">
          Market analysis, research, and insights from Pingu Exchange.
        </p>
      </div>

      <div className="container mb-6">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container mt-12">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'All Articles | Pingu Blog',
    description: 'Browse all articles from Pingu Blog.',
  }
}
