'use client'

import React, { useEffect, useState } from 'react'

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!visible) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 w-9 h-9 rounded-lg bg-[#9051F4] text-white flex items-center justify-center hover:bg-[#9051F4]/90 active:scale-95 transition-all shadow-sm"
      aria-label="Back to top"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M8 3L3 8L4.4 9.4L7 6.8V13H9V6.8L11.6 9.4L13 8L8 3Z" fill="currentColor" />
      </svg>
    </button>
  )
}
