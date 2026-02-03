import Link from 'next/link'
import React from 'react'

export default function NotFound() {
  return (
    <div className="container py-28">
      <div className="max-w-lg mx-auto text-center">
        <h1 className="text-6xl font-bold text-[#9051F4] mb-4">404</h1>
        <p className="text-xl text-white mb-2">Page not found</p>
        <p className="text-[#8D8DC0] mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block h-10 px-6 leading-10 bg-[#9051F4] text-white font-bold text-sm rounded-lg hover:bg-[#9051F4]/90 active:scale-95 transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
