'use client'

import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../../components/ProductCard'
import { usePageMeta } from '../../context/SeoContext'
import SubBanner from '../../components/SubBanner'
import SeoTextBlock from '../../components/SeoTextBlock'

export default function SleepingPills() {
  usePageMeta('Sleeping Pills', 'Quality sleep aids to help you get the rest you deserve.', 'sleeping pills, sleep aids', '/sleeping-pills')
  const { products, loading } = useProducts({ badge: 'sleep aid', limit: 20 })

  return (
    <>
      <SubBanner title="Sleeping Pills" description="Quality sleep aids to help you get the rest you deserve." page="Sleeping Pills" />
      <div className="cat-page">
      <div className="container">
        <h2>Sleeping Pills</h2>
        {loading ? <p>Loading...</p> : (
          <div className="row">{products.map(p => <ProductCard key={p._id} product={p} layout="grid" />)}</div>
        )}
      </div>
    </div>
    <SeoTextBlock>
      <h2>Buy Quality Sleep Aids Online</h2>
      <p>A good night&apos;s sleep is essential for your health, and our sleeping pills category brings you trusted sleep aids that help you fall asleep faster and stay asleep longer. Whether you struggle with occasional sleeplessness or ongoing sleep disruption, we offer options suited to different needs.</p>
      <p>Every sleep aid in our range is sourced from verified manufacturers and checked by our pharmacy team for quality and safety. You can order discreetly online, choose secure payment including Bitcoin, and receive your order with fast, reliable delivery.</p>
      <h3>How to Choose a Sleep Aid</h3>
      <ul>
        <li>Consider the strength and how quickly it works</li>
        <li>Read the product page for dosing and safety details</li>
        <li>Check whether a prescription is required</li>
        <li>Ask our 24/7 support team for guidance if unsure</li>
      </ul>
      <p>Browse the sleep aids above, review the product information carefully, and add the one that fits your needs to your cart. Always follow the recommended dosage and consult your healthcare provider if sleep problems persist.</p>
    </SeoTextBlock>
    </>
  )
}
