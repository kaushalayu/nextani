'use client'

import { useState, useEffect } from 'react'
import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../../components/ProductCard'
import { generatePageMetadata } from '../../lib/seo-metadata'

export default function NewArrivals() {
  const { products, loading } = useProducts({ isNewArrival: true, limit: 20 })

  return (
    <div className="page-container" style={{ padding: '40px 0' }}>
      <div className="container">
        <h1>New Arrivals</h1>
        {loading ? <p>Loading...</p> : (
          <div className="row">{products.map(p => <ProductCard key={p._id} product={p} layout="grid" />)}</div>
        )}
      </div>
    </div>
  )
}
