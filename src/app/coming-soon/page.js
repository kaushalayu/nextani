import { generatePageMetadata } from '../../lib/seo-metadata'
import { getPageMeta, buildMetadata } from '../../lib/page-meta'

export async function generateMetadata() {
  const meta = await getPageMeta('/coming-soon')
  return buildMetadata(meta, 'Coming Soon', 'Stay tuned for exciting new products and features coming soon to Pharmez online pharmacy.') || generatePageMetadata(
    'Coming Soon',
    'Stay tuned for exciting new products and features coming soon to Pharmez online pharmacy.',
    '/coming-soon'
  )
}

export default function ComingSoon() {
  return (
    <div className="coming-soon-page">
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h1>Coming Soon</h1>
        <p>Something exciting is on its way!</p>
      </div>
    </div>
  )
}
