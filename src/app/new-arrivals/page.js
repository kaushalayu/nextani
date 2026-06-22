'use client'

import { useState, useEffect } from 'react'
import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../../components/ProductCard'
import { generatePageMetadata } from '../../lib/seo-metadata'
import SubBanner from '../../components/SubBanner'

export default function NewArrivals() {
  const { products, loading } = useProducts({ isNewArrival: true, limit: 20 })

  return (
    <>
      <SubBanner title="New Arrivals" description="Discover the latest additions to our pharmacy — fresh stock, new formulas." page="New Arrivals" />
      <div className="cat-page">
      <div className="container">
        <h1>New Arrivals</h1>
        {loading ? <p>Loading...</p> : (
          <div className="row">{products.map(p => <ProductCard key={p._id} product={p} layout="grid" />)}</div>
        )}
      </div>
    </div>
    </>
  )
}
