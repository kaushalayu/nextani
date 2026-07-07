'use client'

import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../../components/ProductCard'
import { usePageMeta } from '../../context/SeoContext'
import SubBanner from '../../components/SubBanner'

export default function Painkillers() {
  usePageMeta('Painkillers', 'Effective pain relief solutions for various types of discomfort.', 'painkillers, pain relief', '/painkillers')
  const { products, loading } = useProducts({ badge: 'painkiller', limit: 20 })

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
