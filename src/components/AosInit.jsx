'use client'

import { useEffect } from 'react'

export default function AosInit() {
  useEffect(() => {
    let cancelled = false
    const init = () => {
      if (!cancelled && window.AOS) {
        window.AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true })
      }
    }
    if (window.AOS) {
      init()
    } else {
      const s = document.createElement('script')
      s.src = 'https://unpkg.com/aos@2.3.1/dist/aos.js'
      s.async = true
      s.onload = init
      document.body.appendChild(s)
    }
    return () => {
      cancelled = true
    }
  }, [])
  return null
}
