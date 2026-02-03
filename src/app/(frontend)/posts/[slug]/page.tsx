import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { ReadingProgress } from '@/components/ReadingProgress'
import { ShareButtons } from '@/components/ShareButtons'
import { BackToTop } from '@/components/BackToTop'
import { NewsletterForm } from '@/components/NewsletterForm'
import { getServerSideURL } from '@/utilities/getURL'
import Link from 'next/link'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  const fullUrl = `${getServerSideURL()}/posts/${post.slug}`

  // Get author info
  const postAny = post as any
  const authorObj = typeof postAny.author === 'object' && postAny.author !== null ? postAny.author : null

  return (
    <article className="pt-16 pb-16">
      <ReadingProgress />
      <PageClient />

      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={post} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <div className="max-w-[48rem] mx-auto">
            {/* Share + meta bar */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
              <ShareButtons title={post.title} url={fullUrl} />
              {postAny.readingTime && (
                <span className="text-[#8D8DC0] text-xs hidden sm:block">{postAny.readingTime} min read</span>
              )}
            </div>

            {/* Article content */}
            <RichText className="max-w-none" data={post.content} enableGutter={false} />

            {/* Tags */}
            {postAny.tags && postAny.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-border">
                <p className="text-[#8D8DC0] text-xs uppercase tracking-wider mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {postAny.tags.map((tagItem: any, index: number) => (
                    <Link
                      key={index}
                      href={`/tag/${encodeURIComponent(tagItem.tag)}`}
                      className="text-xs px-2 py-0.5 rounded-md bg-card text-[#8D8DC0] hover:text-white hover:bg-[#9051F4]/20 transition-colors"
                    >
                      {tagItem.tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author bio */}
            {authorObj && (
              <div className="mt-10 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#9051F4]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#9051F4] font-bold">
                      {authorObj.name?.[0] || 'P'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[#8D8DC0] text-xs uppercase tracking-wider mb-1">Written by</p>
                    <p className="text-white font-bold">{authorObj.name}</p>
                    {authorObj.role && (
                      <p className="text-[#8D8DC0] text-sm">{authorObj.role}</p>
                    )}
                    {authorObj.bio && (
                      <p className="text-[#8D8DC0] text-sm mt-2">{authorObj.bio}</p>
                    )}
                    {authorObj.socials?.twitter && (
                      <a
                        href={`https://x.com/${authorObj.socials.twitter.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#9051F4] text-sm hover:underline mt-2 inline-block"
                      >
                        {authorObj.socials.twitter}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Share buttons bottom */}
            <div className="mt-8 pt-6 border-t border-border">
              <ShareButtons title={post.title} url={fullUrl} />
            </div>

            {/* CTA cards */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a href="https://pingu.exchange/trade" target="_blank" rel="noopener noreferrer" className="group rounded-xl bg-card border border-border p-5 hover:border-[#9051F4]/30 transition-all">
                <p className="text-white font-bold mb-1">Trade on Pingu</p>
                <p className="text-[#8D8DC0] text-sm mb-4">
                  Decentralized perpetuals on Monad. Zero spread, oracle-based execution.
                </p>
                <span className="text-[#9051F4] text-sm font-semibold group-hover:text-white transition-colors">
                  Start trading
                </span>
              </a>
              <a href="https://pingu.exchange/referral" target="_blank" rel="noopener noreferrer" className="group rounded-xl bg-card border border-border p-5 hover:border-[#72FFA6]/30 transition-all">
                <p className="text-white font-bold mb-1">Referral Program</p>
                <p className="text-[#8D8DC0] text-sm mb-4">
                  Earn up to 20% commission on trading fees. Progressive tiers, instant payouts.
                </p>
                <span className="text-[#72FFA6] text-sm font-semibold group-hover:text-white transition-colors">
                  Invite friends
                </span>
              </a>
              <a href="https://pingu.exchange/points" target="_blank" rel="noopener noreferrer" className="group rounded-xl bg-card border border-border p-5 hover:border-[#FF99D2]/30 transition-all">
                <p className="text-white font-bold mb-1">Points Campaign</p>
                <p className="text-[#8D8DC0] text-sm mb-4">
                  Trade and earn $PINGU tokens. Multipliers up to 3x. Weekly leaderboards.
                </p>
                <span className="text-[#FF99D2] text-sm font-semibold group-hover:text-white transition-colors">
                  Earn points
                </span>
              </a>
            </div>

            {/* Newsletter + Telegram */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl bg-card border border-border p-6">
                <h3 className="text-base font-bold text-white mb-2">Get weekly insights</h3>
                <p className="text-[#8D8DC0] text-sm mb-4">
                  Market analysis and research delivered to your inbox.
                </p>
                <NewsletterForm />
              </div>
              <a href="https://t.me/PinguExchange" target="_blank" rel="noopener noreferrer" className="group rounded-xl bg-card border border-border p-6 hover:border-[#29B6F6]/30 transition-all flex flex-col">
                <h3 className="text-base font-bold text-white mb-2">Telegram Channel</h3>
                <p className="text-[#8D8DC0] text-sm mb-4 flex-1">
                  Get instant notifications when new articles drop. Join the Pingu community.
                </p>
                <span className="text-[#29B6F6] text-sm font-semibold group-hover:text-white transition-colors">
                  Join Telegram
                </span>
              </a>
            </div>
          </div>

          {/* Related posts */}
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-16 max-w-[52rem] mx-auto"
              docs={post.relatedPosts.filter((post) => typeof post === 'object')}
            />
          )}
        </div>
      </div>

      <BackToTop />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
