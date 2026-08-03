'use client'

import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../../components/ProductCard'
import { usePageMeta } from '../../context/SeoContext'
import SubBanner from '../../components/SubBanner'
import SeoTextBlock from '../../components/SeoTextBlock'

export default function Anxiety() {
  usePageMeta('Anxiety Relief', 'Effective anxiety relief medications to help you manage stress and find calm.', 'anxiety relief, calm', '/anxiety')
  const { products, loading } = useProducts({ badge: 'calm', limit: 20 })

  return (
    <>
      <SubBanner title="Anxiety Pills" description="Effective anxiety relief medications to help you manage stress and find calm." page="Anxiety" />
      <div className="cat-page">
      <div className="container">
        <h2>Anxiety Relief</h2>
        {loading ? <p>Loading...</p> : (
          <div className="row">{products.map(p => <ProductCard key={p._id} product={p} layout="grid" />)}</div>
        )}
      </div>
    </div>
    <SeoTextBlock>
      <h2>Buy Anxiety Relief Medicines Online</h2>
      <p>Anxiety can affect anyone at any time, and finding the right relief makes all the difference. At Painomed, we offer a carefully selected range of anxiety relief medicines designed to help you manage stress, reduce panic symptoms, and restore a sense of calm to your daily routine.</p>
      <p>All anxiety medications in this category are sourced from verified manufacturers and reviewed by our licensed pharmacy team. We handle your order with complete discretion and deliver it safely and quickly to your doorstep. Prescription medicines require a valid prescription, which you can upload during checkout.</p>
      <h3>Common Options for Anxiety Support</h3>
      <ul>
        <li>Medications to reduce general anxiety and stress</li>
        <li>Short-term relief for panic symptoms</li>
        <li>Options to support better sleep alongside anxiety</li>
        <li>Discreet packaging and private, secure ordering</li>
      </ul>
      <p>Take your time browsing the products above and read each product page for dosing guidance and safety information. If you have questions about which option may suit your situation, our customer care team is available 24/7 to guide you.</p>
    </SeoTextBlock>
    </>
  )
}
