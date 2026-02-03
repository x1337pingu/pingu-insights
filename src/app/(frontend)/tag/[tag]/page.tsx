import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'

import { Card } from '@/components/Card'

type Args = {
  params: Promise<{
    tag?: string
  }>
}

export default async function TagPage({ params: paramsPromise }: Args) {
  const { tag = '' } = await paramsPromise
  const decodedTag = decodeURIComponent(tag)

  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 50,
    overrideAccess: false,
    where: {
      _status: { equals: 'published' },
      'tags.tag': { equals: decodedTag },
    },
    sort: '-publishedAt',
  })

  return (
    <div className="pt-16 pb-16">
      <section className="container mb-10">
        <Link
          href="/"
          className="text-[#8D8DC0] text-sm hover:text-white transition-colors mb-4 inline-block"
        >
          &larr; Back to home
        </Link>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">
          Tag: <span className="text-[#9051F4]">{decodedTag}</span>
        </h1>
        <p className="text-[#8D8DC0] mt-2">
          {posts.totalDocs} {posts.totalDocs === 1 ? 'article' : 'articles'}
        </p>
      </section>

      <section className="container">
        {posts.docs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.docs.map((post) => (
              <Card key={post.id} doc={post} relationTo="posts" showCategories />
            ))}
          </div>
        ) : (
          <p className="text-[#8D8DC0]">No articles found with this tag.</p>
        )}
      </section>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { tag = '' } = await paramsPromise
  const decodedTag = decodeURIComponent(tag)

  return {
    title: `Tag: ${decodedTag} | Pingu Blog`,
    description: `Articles tagged with "${decodedTag}" on Pingu Blog.`,
  }
}
