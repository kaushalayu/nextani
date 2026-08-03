'use client'

import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../../components/ProductCard'
import { usePageMeta } from '../../context/SeoContext'
import SubBanner from '../../components/SubBanner'
import SeoTextBlock from '../../components/SeoTextBlock'

export default function NewArrivals() {
  usePageMeta('New Arrivals', 'Discover the latest additions to our pharmacy — fresh stock, new formulas.', 'new arrivals, latest medicines', '/new-arrivals')
  const { products, loading } = useProducts({ isNewArrival: true, limit: 20 })

  return (
    <>
      <SubBanner title="New Arrivals" description="Discover the latest additions to our pharmacy — fresh stock, new formulas." page="New Arrivals" />
      <div className="cat-page">
      <div className="container">
        <h2>New Arrivals</h2>
        {loading ? <p>Loading...</p> : (
          <div className="row">{products.map(p => <ProductCard key={p._id} product={p} layout="grid" />)}</div>
        )}
      </div>
    </div>
    <SeoTextBlock>
      <h2>Fresh Stock &amp; New Medicines at Painomed</h2>
      <p>Welcome to our New Arrivals section — the place where we showcase the latest medicines and wellness products added to the Painomed catalog. We regularly update our stock so you always have access to fresh inventory, new formulas, and improved packaging from trusted manufacturers.</p>
      <p>Every new arrival goes through the same strict quality checks as the rest of our range. Our team verifies each batch to ensure it meets safety standards before it is listed, so you can order new products with full confidence in their authenticity and effectiveness.</p>
      <h3>What to Expect from New Additions</h3>
      <ul>
        <li>Recently stocked medicines with longer expiry dates</li>
        <li>New strengths and formats from leading brands</li>
        <li>Improved formulas for pain, sleep, and anxiety support</li>
        <li>Same fast delivery and secure crypto payment options</li>
      </ul>
      <p>Check back often, because we add new products regularly. If there is a medicine you would like us to stock, let our support team know — we are always happy to expand our range based on customer demand.</p>
    </SeoTextBlock>
    </>
  )
}
