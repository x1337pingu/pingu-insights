import { cn } from '@/utilities/ui'
import React from 'react'

type Props = {
  className?: string
  url?: string | null
  caption?: string | null
  blockType?: string
}

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?#]+)/,
  )
  return match?.[1] || null
}

export const VideoEmbedBlock: React.FC<Props> = ({ className, url, caption }) => {
  if (!url) return null

  const youtubeId = getYouTubeId(url)

  return (
    <figure className={cn('my-8', className)}>
      <div className="rounded-lg overflow-hidden border border-border">
        {youtubeId ? (
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
              title={caption || 'Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="p-4 bg-card text-center">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9051F4] hover:underline"
            >
              Watch Video
            </a>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="text-[#8D8DC0] text-sm mt-2 text-center">{caption}</figcaption>
      )}
    </figure>
  )
}
