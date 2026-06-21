import { generatePageMetadata } from '../../lib/seo-metadata'

export const metadata = generatePageMetadata(
  'Coming Soon',
  'Stay tuned for exciting new products and features coming soon to Pharmez online pharmacy.',
  '/coming-soon'
)

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
