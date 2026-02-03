import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { HomeArticles } from '@/components/HomeArticles'
import { NewsletterForm } from '@/components/NewsletterForm'

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  // Get latest posts
  const latestPosts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 9,
    overrideAccess: true,
    where: {
      _status: { equals: 'published' },
    },
    sort: '-publishedAt',
  })

  // Get categories (only show main editorial categories)
  const categories = await payload.find({
    collection: 'categories',
    limit: 10,
    overrideAccess: true,
    where: {
      slug: {
        in: ['week-in-markets', 'knowledge-base'],
      },
    },
  })

  // Get featured post (most recent)
  const featuredPost = latestPosts.docs[0] || null
  const restPosts = latestPosts.docs.slice(1)

  // Serialize categories for client component
  const categoryData = categories.docs.map((cat) => ({
    id: cat.id,
    title: cat.title,
    slug: cat.slug || '',
    color: (cat as any).color || undefined,
  }))

  return (
    <div className="pt-8 pb-16">
      {/* Hero Section */}
      <section className="container mb-12">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">
            Market Intelligence
            <br />
            <span className="text-[#9051F4]">by Pingu</span>
          </h1>
          <p className="text-[#8D8DC0] text-lg md:text-xl max-w-xl">
            Weekly market analysis, technical charts, crypto research, and macro insights.
          </p>
        </div>
      </section>

      {/* Category Filter + Featured + Articles Grid */}
      <HomeArticles
        categories={categoryData}
        featuredPost={featuredPost as any}
        restPosts={restPosts as any[]}
      />

      {/* CTA cards */}
      <section className="container mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="https://pingu.exchange/trade"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl bg-card border border-border p-5 hover:border-[#9051F4]/30 transition-all"
          >
            <p className="text-white font-bold mb-1">Trade on Pingu</p>
            <p className="text-[#8D8DC0] text-sm mb-4">
              Decentralized perpetuals on Monad. Zero spread, oracle-based execution.
            </p>
            <span className="text-[#9051F4] text-sm font-semibold group-hover:text-white transition-colors">
              Start trading
            </span>
          </a>
          <a
            href="https://pingu.exchange/referral"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl bg-card border border-border p-5 hover:border-[#72FFA6]/30 transition-all"
          >
            <p className="text-white font-bold mb-1">Referral Program</p>
            <p className="text-[#8D8DC0] text-sm mb-4">
              Earn up to 20% commission on trading fees. Progressive tiers, instant payouts.
            </p>
            <span className="text-[#72FFA6] text-sm font-semibold group-hover:text-white transition-colors">
              Invite friends
            </span>
          </a>
          <a
            href="https://pingu.exchange/points"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl bg-card border border-border p-5 hover:border-[#FF99D2]/30 transition-all"
          >
            <p className="text-white font-bold mb-1">Points Campaign</p>
            <p className="text-[#8D8DC0] text-sm mb-4">
              Trade and earn $PINGU tokens. Multipliers up to 3x. Weekly leaderboards.
            </p>
            <span className="text-[#FF99D2] text-sm font-semibold group-hover:text-white transition-colors">
              Earn points
            </span>
          </a>
        </div>
      </section>

      {/* Newsletter + Telegram */}
      <section className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-card border border-border p-6 md:p-10">
            <h2 className="text-xl font-extrabold text-white mb-2">Stay in the loop</h2>
            <p className="text-[#8D8DC0] text-sm mb-5">
              Weekly market analysis and research delivered to your inbox.
            </p>
            <NewsletterForm />
          </div>
          <a
            href="https://t.me/PinguExchange"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl bg-card border border-border p-6 md:p-10 hover:border-[#29B6F6]/30 transition-all flex flex-col"
          >
            <h2 className="text-xl font-extrabold text-white mb-2">Telegram Channel</h2>
            <p className="text-[#8D8DC0] text-sm mb-5 flex-1">
              Get instant notifications when new articles drop. Real-time market alerts and community discussion.
            </p>
            <span className="text-[#29B6F6] text-sm font-semibold group-hover:text-white transition-colors">
              Join Telegram
            </span>
          </a>
        </div>
      </section>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Pingu Blog | Market Intelligence & Research',
  description:
    'Weekly market analysis, technical charts, crypto research, and macro insights from Pingu Exchange.',
}
