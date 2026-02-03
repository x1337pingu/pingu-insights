import { cn } from '@/utilities/ui'
import React from 'react'

import { Media } from '@/components/Media'

type Props = {
  className?: string
  ticker?: string | null
  chartImage?: any
  caption?: string | null
  source?: string | null
  blockType?: string
}

export const ChartEmbedBlock: React.FC<Props> = ({
  className,
  ticker,
  chartImage,
  caption,
  source,
}) => {
  return (
    <figure className={cn('my-8', className)}>
      <div className="rounded-lg overflow-hidden border border-border">
        {ticker && (
          <div className="bg-card px-4 py-2 flex items-center justify-between">
            <span className="text-[#9051F4] font-mono font-semibold text-sm">{ticker}</span>
            {source && <span className="text-[#8D8DC0] text-xs">{source}</span>}
          </div>
        )}
        {chartImage && typeof chartImage !== 'string' && (
          <Media resource={chartImage} />
        )}
      </div>
      {caption && (
        <figcaption className="text-[#8D8DC0] text-sm mt-2 text-center">{caption}</figcaption>
      )}
    </figure>
  )
}
