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

  return (
    <section className="container mb-16">
      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8 max-w-[900px] mx-auto">
          <button
            onClick={() => setActiveCategory(null)}
            className={`text-sm font-semibold px-4 py-1.5 rounded-md transition-all ${
              !activeCategory
                ? 'bg-[#9051F4] text-white'
                : 'text-[#8D8DC0] hover:text-white'
            }`}
          >
            All
          </button>
          {categories.map((category) => {
            const isActive = activeCategory === category.slug
            const color = category.color || '#9051F4'
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(isActive ? null : category.slug)}
                className="text-sm font-semibold px-4 py-1.5 rounded-md transition-all"
                style={
                  isActive
                    ? { backgroundColor: color, color: '#fff' }
                    : { color: color, opacity: 0.7 }
                }
              >
                {category.title}
              </button>
            )
          })}
        </div>
      )}

      {/* Article list */}
      <div className="max-w-[900px] mx-auto flex flex-col gap-5">
        {displayPosts.map((post) => {
          const imageUrl = getImageUrl(post)
          const imageAlt = getImageAlt(post)
          const excerptText = post.excerpt || post.meta?.description

          return (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="group flex flex-col sm:flex-row rounded-xl overflow-hidden border border-border bg-card hover:border-[#9051F4]/40 transition-all"
            >
              {/* Image */}
              <div className="relative w-full sm:w-[300px] shrink-0 aspect-video sm:aspect-auto sm:min-h-[180px] overflow-hidden">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={imageAlt}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-card" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-5 sm:py-6 flex flex-col justify-center min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  {(post.categories as any[])?.map((cat, index) => {
                    if (typeof cat === 'object' && cat !== null) {
                      const catColor = cat.color || '#9051F4'
                      return (
                        <span
                          key={index}
                          className="text-xs font-semibold px-2 py-0.5 rounded-md"
                          style={{
                            backgroundColor: `${catColor}20`,
                            color: catColor,
                          }}
                        >
                          {cat.title}
                        </span>
                      )
                    }
                    return null
                  })}
                  {post.publishedAt && (
                    <span className="text-xs text-[#8D8DC0]">
                      {formatDate(post.publishedAt)}
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-[#9051F4] transition-colors">
                  {post.title}
                </h2>

                {excerptText && (
                  <p className="text-sm text-[#8D8DC0] line-clamp-2 leading-relaxed">
                    {excerptText}
                  </p>
                )}
              </div>
            </Link>
          )
        })}

        {/* Empty state */}
        {displayPosts.length === 0 && (
          <p className="text-[#8D8DC0] text-center py-12">
            No articles in this category yet.
          </p>
        )}
      </div>
    </section>
  )
}
