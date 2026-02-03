'use client'

import { cn } from '@/utilities/ui'
import React, { useState } from 'react'

import { Media } from '@/components/Media'

type GalleryImage = {
  image?: any
  caption?: string | null
  id?: string | null
}

type Props = {
  className?: string
  images?: GalleryImage[] | null
  layout?: 'grid' | 'carousel' | null
  blockType?: string
}

export const ImageGalleryBlock: React.FC<Props> = ({
  className,
  images,
  layout = 'grid',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) return null

  if (layout === 'carousel') {
    const current = images[currentIndex]

    return (
      <div className={cn('my-8', className)}>
        <div className="relative rounded-lg overflow-hidden border border-border">
          {current?.image && typeof current.image !== 'string' && (
            <Media resource={current.image} />
          )}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#9051F4]"
                aria-label="Previous image"
              >
                &lsaquo;
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#9051F4]"
                aria-label="Next image"
              >
                &rsaquo;
              </button>
            </>
          )}
        </div>
        {current?.caption && (
          <p className="text-[#8D8DC0] text-sm mt-2 text-center">{current.caption}</p>
        )}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-3">
            {images.map((_: GalleryImage, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  index === currentIndex ? 'bg-[#9051F4]' : 'bg-muted',
                )}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('my-8', className)}>
      <div
        className={cn('grid gap-4', {
          'grid-cols-1 sm:grid-cols-2': images.length === 2,
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': images.length >= 3,
        })}
      >
        {images.map((item: GalleryImage, index: number) => (
          <figure key={index} className="rounded-lg overflow-hidden border border-border">
            {item.image && typeof item.image !== 'string' && (
              <Media resource={item.image} />
            )}
            {item.caption && (
              <figcaption className="text-[#8D8DC0] text-xs p-2 text-center bg-card">
                {item.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  )
}
