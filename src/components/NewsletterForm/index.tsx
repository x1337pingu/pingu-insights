'use client'

import React, { useState } from 'react'

export const NewsletterForm: React.FC<{ className?: string }> = ({ className }) => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setStatus('success')
        setMessage('Subscribed. Welcome aboard.')
        setEmail('')
      } else {
        const data = await res.json()
        setStatus('error')
        setMessage(data.message || 'Something went wrong.')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Try again.')
    }
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 h-9 px-3 bg-input/30 border border-border rounded-lg text-white placeholder-[#8D8DC0] text-sm focus:outline-none focus:border-[#9051F4] focus:ring-[3px] focus:ring-[#9051F4]/20 transition-all shadow-xs"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="h-9 px-4 bg-[#9051F4] text-white font-bold text-sm rounded-lg hover:bg-[#9051F4]/90 active:scale-95 transition-all disabled:opacity-50"
        >
          {status === 'loading' ? '...' : 'Subscribe'}
        </button>
      </form>
      {message && (
        <p
          className={`text-sm mt-2 text-center ${
            status === 'success' ? 'text-[#72FFA6]' : 'text-[#A13E73]'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  )
}
