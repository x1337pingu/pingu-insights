'use client'

import React, { useState, useMemo } from 'react'
import { Card } from '@/components/Card'
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
  [key: string]: any
}

type Props = {
  categories: CategoryData[]
  featuredPost: PostData | null
  restPosts: PostData[]
}

export const HomeArticles: React.FC<Props> = ({ categories, featuredPost, restPosts }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const allPosts = useMemo(() => {
    return featuredPost ? [featuredPost, ...restPosts] : restPosts
  }, [featuredPost, restPosts])

  const filteredPosts = useMemo(() => {
    if (!activeCategory) return null
    return allPosts.filter((post) => {
      const cats = post.categories as any[]
      if (!cats) return false
      return cats.some((cat) => {
        if (typeof cat === 'object' && cat !== null) return cat.slug === activeCategory
        return false
      })
    })
  }, [activeCategory, allPosts])

  const isFiltered = activeCategory !== null
  const displayFeatured = isFiltered ? null : featuredPost
  const displayGrid = isFiltered ? (filteredPosts || []) : restPosts

  return (
    <>
      {/* Category filter */}
      {categories.length > 0 && (
        <section className="container mb-8">
          <div className="flex flex-wrap gap-2">
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
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(isActive ? null : category.slug)}
                  className={`text-sm font-semibold px-4 py-1.5 rounded-md transition-all ${
                    isActive
                      ? 'bg-[#9051F4] text-white'
                      : 'text-[#8D8DC0] hover:text-white'
                  }`}
                >
                  {category.title}
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* Featured Post (only in "All" mode) */}
      {displayFeatured && (
        <section className="container mb-16">
          <Link
            href={`/posts/${displayFeatured.slug}`}
            className="group block rounded-xl overflow-hidden border border-border hover:border-[#9051F4]/40 transition-all"
          >
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative aspect-video md:aspect-auto overflow-hidden">
                {displayFeatured.heroImage && typeof displayFeatured.heroImage !== 'string' && (
                  <img
                    src={(displayFeatured.heroImage as any).url || ''}
                    alt={displayFeatured.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                )}
                {displayFeatured.meta?.image && typeof displayFeatured.meta.image !== 'string' && !displayFeatured.heroImage && (
                  <img
                    src={(displayFeatured.meta.image as any).url || ''}
                    alt={displayFeatured.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                )}
                {(!displayFeatured.heroImage || typeof displayFeatured.heroImage === 'string') &&
                  (!displayFeatured.meta?.image || typeof displayFeatured.meta.image === 'string') && (
                    <div className="w-full h-full min-h-[200px] bg-card" />
                  )}
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center bg-card">
                <div className="flex flex-wrap gap-2 mb-3">
                  {(displayFeatured.categories as any[])?.map((cat, index) => {
                    if (typeof cat === 'object' && cat !== null) {
                      return (
                        <span
                          key={index}
                          className="text-xs font-semibold px-2 py-0.5 rounded-md"
                          style={{
                            backgroundColor: `${cat.color || '#9051F4'}20`,
                            color: cat.color || '#9051F4',
                          }}
                        >
                          {cat.title}
                        </span>
                      )
                    }
                    return null
                  })}
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 group-hover:text-[#9051F4] transition-colors">
                  {displayFeatured.title}
                </h2>
                {(displayFeatured.excerpt || displayFeatured.meta?.description) && (
                  <p className="text-[#8D8DC0] mb-4 line-clamp-3">
                    {displayFeatured.excerpt || displayFeatured.meta?.description}
                  </p>
                )}
                <span className="text-[#9051F4] text-sm font-semibold">Read article</span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Articles Grid */}
      {displayGrid.length > 0 && (
        <section className="container mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-extrabold text-white">
              {isFiltered
                ? categories.find((c) => c.slug === activeCategory)?.title || 'Articles'
                : 'Latest Articles'}
            </h2>
            <Link
              href="/posts"
              className="text-sm font-semibold text-[#9051F4] hover:text-white transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayGrid.map((post, index) => (
              <Card
                key={post.id || index}
                doc={post as any}
                relationTo="posts"
                showCategories
                className="h-full"
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {isFiltered && displayGrid.length === 0 && (
        <section className="container mb-16">
          <p className="text-[#8D8DC0] text-center py-12">
            No articles in this category yet.
          </p>
        </section>
      )}
    </>
  )
}
