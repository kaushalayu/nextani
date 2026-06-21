'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import API from '../../lib/api'
import ProductCard from '../../components/ProductCard'

export default function Shop() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ limit: '12', isActive: 'true' })
    if (search) params.append('search', search)
    if (category) params.append('category', category)
    API.get(`/products?${params}`)
      .then(({ data }) => setProducts(data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [search, category])

  return (
    <div className="shop-page">
      <div className="container" style={{ padding: '40px 0' }}>
        <h1>Shop Medicines</h1>
        {loading ? <p>Loading...</p> : (
          <div className="row">
            {products.map(p => <ProductCard key={p._id} product={p} layout="grid" />)}
          </div>
        )}
      </div>
    </div>
  )
}
