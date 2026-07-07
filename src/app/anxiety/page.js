'use client'

import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../../components/ProductCard'
import { usePageMeta } from '../../context/SeoContext'
import SubBanner from '../../components/SubBanner'

export default function Anxiety() {
  usePageMeta('Anxiety Relief', 'Effective anxiety relief medications to help you manage stress and find calm.', 'anxiety relief, calm', '/anxiety')
  const { products, loading } = useProducts({ badge: 'calm', limit: 20 })

  return (
    <>
      <SubBanner title="Anxiety Pills" description="Effective anxiety relief medications to help you manage stress and find calm." page="Anxiety" />
      <div className="cat-page">
      <div className="container">
        <h1>Anxiety Relief</h1>
        {loading ? <p>Loading...</p> : (
          <div className="row">{products.map(p => <ProductCard key={p._id} product={p} layout="grid" />)}</div>
        )}
      </div>
    </div>
    </>
  )
}
