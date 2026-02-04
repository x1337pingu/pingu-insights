'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'

type CategoryData = {
  id: string | number
  title: string
  slug: string
  color?: string
}

type PostData = {
  id: string | number
  slug: string
  title: string
  heroImage?: any
  meta?: { image?: any; description?: string }
  categories?: any[]
  excerpt?: string
  readingTime?: number
  publishedAt?: string
  [key: string]: any
}

type Props = {
  categories: CategoryData[]
  posts: PostData[]
}

function formatDate(timestamp: string): string {
  const date = new Date(timestamp)
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

function getImageUrl(post: PostData): string | null {
  const img = post.heroImage || post.meta?.image
  if (img && typeof img === 'object' && img !== null) {
    return img.sizes?.card?.url || img.url || null
  }
  return null
}

function getImageAlt(post: PostData): string {
  const img = post.heroImage || post.meta?.image
  if (img && typeof img === 'object' && img !== null) {
    return img.alt || post.title
  }
  return post.title
}

function CategoryBadge({ cat }: { cat: any }) {
  if (typeof cat !== 'object' || cat === null) return null
  const color = cat.color || '#9051F4'
  return (
    <span
      className="text-xs font-semibold tracking-wide uppercase"
      style={{ color }}
    >
      {cat.title}
    </span>
  )
}

/* ── Featured card (first article) ── */
function FeaturedArticle({ post }: { post: PostData }) {
  const imageUrl = getImageUrl(post)
  const imageAlt = getImageAlt(post)
  const excerptText = post.excerpt || post.meta?.description

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block rounded-2xl overflow-hidden bg-card/60 hover:bg-card transition-all duration-300"
      style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.15), 0 0 0 1px rgba(144,81,244,0.04)' }}
    >
      {/* Large hero image */}
      {imageUrl && (
        <div className="relative w-full aspect-[2/1] overflow-hidden">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          {(post.categories as any[])?.map((cat, i) => (
            <CategoryBadge key={i} cat={cat} />
          ))}
          {post.publishedAt && (
            <span className="text-xs text-[#8D8DC0]">
              {formatDate(post.publishedAt)}
            </span>
          )}
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-[#9051F4] transition-colors leading-tight">
          {post.title}
        </h2>

        {excerptText && (
          <p className="text-[#8D8DC0] text-base md:text-lg leading-relaxed line-clamp-2 mb-4">
            {excerptText}
          </p>
        )}

        <span className="text-[#9051F4] text-sm font-semibold group-hover:text-white transition-colors">
          Read article
        </span>
      </div>
    </Link>
  )
}

/* ── List item (subsequent articles) ── */
function ArticleListItem({ post }: { post: PostData }) {
  const imageUrl = getImageUrl(post)
  const imageAlt = getImageAlt(post)
  const excerptText = post.excerpt || post.meta?.description

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group flex gap-6 py-6"
    >
      {/* Text content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          {(post.categories as any[])?.map((cat, i) => (
            <CategoryBadge key={i} cat={cat} />
          ))}
          {post.publishedAt && (
            <span className="text-xs text-[#8D8DC0]">
              {formatDate(post.publishedAt)}
            </span>
          )}
        </div>

        <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-[#9051F4] transition-colors leading-snug">
          {post.title}
        </h3>

        {excerptText && (
          <p className="text-sm text-[#8D8DC0] line-clamp-2 leading-relaxed">
            {excerptText}
          </p>
        )}
      </div>

      {/* Thumbnail */}
      {imageUrl && (
        <div className="hidden sm:block w-[180px] h-[120px] shrink-0 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        </div>
      )}
    </Link>
  )
}

/* ── Main component ── */
export const HomeArticles: React.FC<Props> = ({ categories, posts }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const displayPosts = useMemo(() => {
    if (!activeCategory) return posts
    return posts.filter((post) => {
      const cats = post.categories as any[]
      if (!cats) return false
      return cats.some((cat) => {
        if (typeof cat === 'object' && cat !== null) return cat.slug === activeCategory
        return false
      })
    })
  }, [activeCategory, posts])

  const featured = displayPosts[0]
  const rest = displayPosts.slice(1)

  return (
    <section className="container mb-16">
      {/* Category filter - clean tabs */}
      {categories.length > 0 && (
        <div className="flex items-center gap-1 mb-10">
          <button
            onClick={() => setActiveCategory(null)}
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${
              !activeCategory
                ? 'bg-[#9051F4]/15 text-[#9051F4]'
                : 'text-[#8D8DC0] hover:text-white'
            }`}
          >
            All
          </button>
          {categories.map((category) => {
            const isActive = activeCategory === category.slug
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(isActive ? null : category.slug)}
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#9051F4]/15 text-white'
                    : 'text-[#8D8DC0] hover:text-white'
                }`}
              >
                {category.title}
              </button>
            )
          })}
        </div>
      )}

      {/* Featured article */}
      {featured && <FeaturedArticle post={featured} />}

      {/* Article list with dividers */}
      {rest.length > 0 && (
        <div className="mt-8 divide-y divide-border">
          {rest.map((post) => (
            <ArticleListItem key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {displayPosts.length === 0 && (
        <p className="text-[#8D8DC0] text-center py-12">
          No articles in this category yet.
        </p>
      )}
    </section>
  )
}
