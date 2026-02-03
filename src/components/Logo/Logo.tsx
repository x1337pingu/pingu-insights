import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { className } = props

  return (
    <span className={clsx('inline-flex items-center gap-1', className)}>
      <span className="text-xl font-bold tracking-tight">
        <span className="text-white">Pingu</span>
        <span className="text-[#9051F4]"> Blog</span>
      </span>
    </span>
  )
}

export default Logo
