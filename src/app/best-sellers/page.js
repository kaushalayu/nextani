'use client'

import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../../components/ProductCard'
import SubBanner from '../../components/SubBanner'

export default function BestSellers() {
  const { products, loading } = useProducts({ isBestSeller: true, limit: 20 })

  return (
    <>
      <SubBanner title="Best Sellers" description="Our most popular products, trusted by thousands of customers." page="Best Sellers" />
      <div className="cat-page">
      <div className="container">
        <h1>Best Sellers</h1>
        {loading ? <p>Loading...</p> : (
          <div className="row">{products.map(p => <ProductCard key={p._id} product={p} layout="grid" />)}</div>
        )}
      </div>
    </div>
    </>
  )
}
