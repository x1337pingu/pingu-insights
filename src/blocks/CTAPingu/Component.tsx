import { cn } from '@/utilities/ui'
import React from 'react'

type CTAPinguBlockProps = {
  heading?: string | null
  description?: string | null
  buttonText?: string | null
  buttonUrl?: string | null
  style?: 'primary' | 'secondary' | 'outline' | null
  blockType: 'ctaPingu'
}

type Props = {
  className?: string
} & CTAPinguBlockProps

export const CTAPinguBlock: React.FC<Props> = ({
  className,
  heading,
  description,
  buttonText,
  buttonUrl,
  style = 'primary',
}) => {
  return (
    <div
      className={cn(
        'my-8 rounded-xl p-6 md:p-8 text-center',
        {
          'bg-[#9051F4]': style === 'primary',
          'bg-card border border-border': style === 'secondary',
          'border border-[#9051F4]/40 bg-transparent': style === 'outline',
        },
        className,
      )}
    >
      {heading && (
        <h3 className="text-xl font-extrabold text-white mb-2">{heading}</h3>
      )}
      {description && (
        <p className={cn('mb-5 max-w-lg mx-auto text-sm', {
          'text-white/80': style === 'primary',
          'text-[#8D8DC0]': style !== 'primary',
        })}>{description}</p>
      )}
      {buttonText && buttonUrl && (
        <a
          href={buttonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-block h-10 leading-10 px-6 rounded-lg font-bold text-sm active:scale-95 transition-all',
            {
              'bg-white text-[#9051F4] hover:bg-white/90': style === 'primary',
              'bg-[#9051F4] text-white hover:bg-[#9051F4]/90': style !== 'primary',
            },
          )}
        >
          {buttonText}
        </a>
      )}
    </div>
  )
}
