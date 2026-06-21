'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('pharmez_wishlist') : null
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('pharmez_wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const addToWishlist = (item) => {
    setWishlist(prev => {
      if (prev.find(p => p.id === item.id)) return prev
      return [...prev, { ...item, addedAt: Date.now() }]
    })
  }

  const removeFromWishlist = (id) => {
    setWishlist(prev => prev.filter(p => p.id !== id))
  }

  const clearWishlist = () => setWishlist([])

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider')
  return ctx
}
