'use client'

import { useState, useEffect } from 'react'
import API from '../../lib/api'
import ProductCard from '../../components/ProductCard'

export default function AllMedicines() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/products?limit=50&isActive=true')
      .then(({ data }) => setProducts(data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page-container" style={{ padding: '40px 0' }}>
      <div className="container">
        <h1>All Medicines</h1>
        {loading ? <p>Loading...</p> : (
          <div className="row">{products.map(p => <ProductCard key={p._id} product={p} layout="grid" />)}</div>
        )}
      </div>
    </div>
  )
}
