'use client'

import { useState, useEffect } from 'react'

function Preloader() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => setLoading(false), 350)
    }
    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }
  }, [])

  if (!loading) return null

  return (
    <div className="loader-mask">
      <div className="loader">
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default Preloader
