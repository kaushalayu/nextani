'use client'

import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../../components/ProductCard'
import { usePageMeta } from '../../context/SeoContext'
import SubBanner from '../../components/SubBanner'
import SeoTextBlock from '../../components/SeoTextBlock'

export default function BestSellers() {
  usePageMeta('Best Sellers', 'Our most popular products, trusted by thousands of customers.', 'best sellers, popular medicines', '/best-sellers')
  const { products, loading } = useProducts({ isBestSeller: true, limit: 20 })

  return (
    <>
      <SubBanner title="Best Sellers" description="Our most popular products, trusted by thousands of customers." page="Best Sellers" />
      <div className="cat-page">
      <div className="container">
        <h2>Best Sellers</h2>
        {loading ? <p>Loading...</p> : (
          <div className="row">{products.map(p => <ProductCard key={p._id} product={p} layout="grid" />)}</div>
        )}
      </div>
    </div>
    <SeoTextBlock>
      <h2>Most Popular Medicines Customers Trust at Painomed</h2>
      <p>Our best sellers are the medicines and wellness products ordered most often by customers across the United States. These popular medicines are consistently chosen for their trusted quality, reliable effect, and the fast delivery we promise on every order. When you browse our best sellers, you are looking at the remedies that thousands of customers have already relied on for pain relief, better sleep, and anxiety management.</p>
      <p>Every product featured here is sourced from verified manufacturers and carefully checked by our licensed pharmacy team before it reaches your door. Whether you need strong painkillers, sleeping pills, or calm and anxiety support, our best-selling medicines are available with secure payment options, including Bitcoin and other cryptocurrencies.</p>
      <h3>Why These Products Sell the Most</h3>
      <ul>
        <li>Trusted quality from verified manufacturers</li>
        <li>Consistent availability and reliable stock</li>
        <li>Fast, free delivery on qualifying orders</li>
        <li>Flexible payment methods, including crypto</li>
        <li>24/7 customer support before and after purchase</li>
      </ul>
      <p>Browse the collection above, read the product details, and add the medicines you need to your cart. If you are unsure which product suits your condition, contact our support team anytime — we are here to help you make the right choice.</p>
    </SeoTextBlock>
    </>
  )
}
