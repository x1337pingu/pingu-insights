'use client'

import React, { useState } from 'react'

interface ShareButtonsProps {
  title: string
  url: string
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url }) => {
  const [copied, setCopied] = useState(false)

  const shareOnX = () => {
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      '_blank',
    )
  }

  const shareOnTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      '_blank',
    )
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-[#8D8DC0] text-sm">Share</span>
      <button
        onClick={shareOnX}
        className="px-3 py-1.5 text-xs font-medium bg-card border border-border rounded-lg text-[#D5D5DA] hover:border-[#9051F4]/40 hover:text-white transition-colors"
        aria-label="Share on X"
      >
        X
      </button>
      <button
        onClick={shareOnTelegram}
        className="px-3 py-1.5 text-xs font-medium bg-card border border-border rounded-lg text-[#D5D5DA] hover:border-[#9051F4]/40 hover:text-white transition-colors"
        aria-label="Share on Telegram"
      >
        Telegram
      </button>
      <button
        onClick={copyLink}
        className="px-3 py-1.5 text-xs font-medium bg-card border border-border rounded-lg text-[#D5D5DA] hover:border-[#9051F4]/40 hover:text-white transition-colors"
        aria-label="Copy link"
      >
        {copied ? 'Copied' : 'Copy Link'}
      </button>
    </div>
  )
}
