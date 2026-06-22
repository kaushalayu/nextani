import { generatePageMetadata } from '../../lib/seo-metadata'
import SubBanner from '../../components/SubBanner'
import Link from 'next/link'

export const metadata = generatePageMetadata('Coming Soon', 'Stay tuned for exciting new products and features coming soon to Pharmez online pharmacy.', '/coming-soon')

export default function ComingSoon() {
  return (
    <>
      <SubBanner title="Coming Soon" description="Stay tuned for exciting new products and features coming soon to Pharmez online pharmacy." page="Coming Soon" />
      <div className="padding-rl float-left w-100">
        <div className="container">
          <div className="coming-soon-section">
            <div className="coming-soon-icon"><i className="fa-regular fa-clock" /></div>
            <h2>Something Exciting is Coming!</h2>
            <p className="coming-soon-text">We&apos;re working on something special. Stay tuned for updates on our latest products and services.</p>
            <Link href="/shop" className="coming-soon-btn">Browse Products</Link>
          </div>
        </div>
      </div>
    </>
  )
}
