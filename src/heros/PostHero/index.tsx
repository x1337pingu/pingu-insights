import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, heroImage, populatedAuthors, publishedAt, title } = post
  const postAny = post as any
  const excerpt = postAny.excerpt as string | null | undefined
  const readingTime = postAny.readingTime as number | null | undefined
  const author = postAny.author as any

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  const authorName = typeof author === 'object' && author !== null ? author.name : null

  return (
    <div className="relative -mt-[4.5rem] flex items-end">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          {/* Category badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories?.map((category, index) => {
              if (typeof category === 'object' && category !== null) {
                const { title: categoryTitle } = category
                const color = (category as any).color || '#9051F4'
                return (
                  <span
                    key={index}
                    className="text-xs font-semibold px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: `${color}30`,
                      color: color,
                    }}
                  >
                    {categoryTitle || 'Untitled'}
                  </span>
                )
              }
              return null
            })}
          </div>

          <h1 className="mb-4 text-3xl md:text-5xl lg:text-6xl font-extrabold">{title}</h1>

          {excerpt && (
            <p className="text-[#8D8DC0] text-lg mb-6 max-w-2xl">{excerpt}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-[#8D8DC0]">
            {(authorName || hasAuthors) && (
              <span className="text-[#D5D5DA] font-medium">
                {authorName || formatAuthors(populatedAuthors!)}
              </span>
            )}
            {publishedAt && (
              <>
                <span className="opacity-30">/</span>
                <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
              </>
            )}
            {readingTime && (
              <>
                <span className="opacity-30">/</span>
                <span>{readingTime} min read</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="min-h-[70vh] select-none">
        {heroImage && typeof heroImage !== 'string' && (
          <Media fill priority imgClassName="-z-10 object-cover" resource={heroImage} />
        )}
        <div className="absolute pointer-events-none left-0 bottom-0 w-full h-2/3" style={{ background: 'linear-gradient(to top, oklch(0.22 0.012 290), oklch(0.18 0.014 297 / 0.8), transparent)' }} />
      </div>
    </div>
  )
}
