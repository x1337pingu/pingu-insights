'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'> & {
  excerpt?: string | null
  heroImage?: Post['heroImage'] | null
}

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, meta, title, excerpt, heroImage } = doc || {}
  const { description, image: metaImage } = meta || {}
  const cardImage = metaImage || (typeof heroImage === 'object' && heroImage !== null ? heroImage : null)

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const excerptText = (excerpt as string) || description
  const sanitizedDescription = excerptText?.replace(/\s/g, ' ')
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'group border border-border rounded-xl overflow-hidden bg-card shadow-sm hover:border-[#9051F4]/30 transition-all duration-200 hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-full aspect-video overflow-hidden">
        {!cardImage && (
          <div className="w-full h-full bg-card" />
        )}
        {cardImage && typeof cardImage !== 'string' && (
          <Media
            resource={cardImage}
            size="33vw"
            imgClassName="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-300"
          />
        )}
      </div>
      <div className="p-5">
        {showCategories && hasCategories && (
          <div className="flex flex-wrap gap-2 mb-3">
            {categories?.map((category, index) => {
              if (typeof category === 'object' && category !== null) {
                const { title: categoryTitle } = category
                const color = (category as any).color || '#9051F4'
                return (
                  <span
                    key={index}
                    className="text-xs font-semibold px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: `${color}20`,
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
        )}
        {titleToUse && (
          <h3 className="text-base font-bold text-white mb-2 line-clamp-2 group-hover:text-[#9051F4] transition-colors">
            <Link href={href} ref={link.ref}>
              {titleToUse}
            </Link>
          </h3>
        )}
        {sanitizedDescription && (
          <p className="text-[#8D8DC0] text-sm line-clamp-2">{sanitizedDescription}</p>
        )}
      </div>
    </article>
  )
}
