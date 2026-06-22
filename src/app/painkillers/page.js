'use client'

import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../../components/ProductCard'
import SubBanner from '../../components/SubBanner'

export default function Painkillers() {
  const { products, loading } = useProducts({ badge: 'painkillers', limit: 20 })

  return (
    <>
      <SubBanner title="Painkillers" description="Effective pain relief solutions for various types of discomfort." page="Painkillers" />
      <div className="cat-page">
      <div className="container">
        <h1>Painkillers</h1>
        {loading ? <p>Loading...</p> : (
          <div className="row">{products.map(p => <ProductCard key={p._id} product={p} layout="grid" />)}</div>
        )}
      </div>
    </div>
    </>
  )
}
