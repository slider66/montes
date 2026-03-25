'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export function FloatingEncargoCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className="fixed bottom-6 z-50"
      style={{
        left: '50%',
        opacity: visible ? 1 : 0,
        transform: visible
          ? 'translateX(-50%) translateY(0)'
          : 'translateX(-50%) translateY(16px)',
        transition: 'opacity 300ms, transform 300ms',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <Link
        href="/encargo"
        className="flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold whitespace-nowrap"
        style={{
          background: 'linear-gradient(135deg, #EAB85A 0%, #C47832 100%)',
          color: '#1A0E05',
          boxShadow: '0 4px 28px rgba(212,137,58,0.50), 0 1px 0 rgba(255,255,255,0.10) inset',
        }}
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M1 1h2.5l1.6 7.4a1 1 0 00.98.8h5.84a1 1 0 00.97-.76L14 4H4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="6" cy="13" r="1" fill="currentColor"/>
          <circle cx="11" cy="13" r="1" fill="currentColor"/>
        </svg>
        Realizar un encargo
      </Link>
    </div>
  )
}
