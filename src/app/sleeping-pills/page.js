'use client'

import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../../components/ProductCard'

export default function SleepingPills() {
  const { products, loading } = useProducts({ badge: 'sleep aid', limit: 20 })

  return (
    <div className="page-container" style={{ padding: '40px 0' }}>
      <div className="container">
        <h1>Sleeping Pills</h1>
        {loading ? <p>Loading...</p> : (
          <div className="row">{products.map(p => <ProductCard key={p._id} product={p} layout="grid" />)}</div>
        )}
      </div>
    </div>
  )
}
