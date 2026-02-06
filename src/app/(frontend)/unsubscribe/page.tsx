'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'invalid'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('invalid')
      setMessage('Invalid unsubscribe link.')
      return
    }

    const unsubscribe = async () => {
      try {
        const res = await fetch('/api/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })

        const data = await res.json()

        if (res.ok) {
          setStatus('success')
          setMessage(data.message || 'You have been unsubscribed.')
        } else {
          setStatus('error')
          setMessage(data.message || 'Something went wrong.')
        }
      } catch {
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
      }
    }

    unsubscribe()
  }, [token])

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="w-12 h-12 border-2 border-[#9051F4] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <p className="text-gray-400">Processing your request...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-[#72FFA6]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#72FFA6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Unsubscribed</h1>
            <p className="text-gray-400 mb-8">{message}</p>
            <p className="text-gray-500 text-sm mb-6">
              Changed your mind? You can always subscribe again on our blog.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#9051F4] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#7B3FD9] transition-colors"
            >
              Back to Blog
            </Link>
          </>
        )}

        {(status === 'error' || status === 'invalid') && (
          <>
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Oops</h1>
            <p className="text-gray-400 mb-8">{message}</p>
            <Link
              href="/"
              className="inline-block bg-[#9051F4] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#7B3FD9] transition-colors"
            >
              Back to Blog
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#9051F4] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  )
}
