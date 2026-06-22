'use client'

import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../../components/ProductCard'
import SubBanner from '../../components/SubBanner'

export default function SleepingPills() {
  const { products, loading } = useProducts({ badge: 'sleep aid', limit: 20 })

  return (
    <>
      <SubBanner title="Sleeping Pills" description="Quality sleep aids to help you get the rest you deserve." page="Sleeping Pills" />
      <div className="cat-page">
      <div className="container">
        <h1>Sleeping Pills</h1>
        {loading ? <p>Loading...</p> : (
          <div className="row">{products.map(p => <ProductCard key={p._id} product={p} layout="grid" />)}</div>
        )}
      </div>
    </div>
    </>
  )
}
