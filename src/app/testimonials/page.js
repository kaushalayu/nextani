import { generatePageMetadata } from '../../lib/seo-metadata'
import { getPageMeta, buildMetadata } from '../../lib/page-meta'

export async function generateMetadata() {
  const meta = await getPageMeta('/testimonials')
  return buildMetadata(meta, 'Testimonials', 'Read what our customers say about Pharmez. Real reviews from real customers who trust us for their medicine delivery needs.') || generatePageMetadata(
    'Testimonials',
    'Read what our customers say about Pharmez. Real reviews from real customers who trust us for their medicine delivery needs.',
    '/testimonials'
  )
}

export default function Testimonials() {
  return (
    <div className="testimonials-page">
      <div className="container" style={{ padding: '60px 0' }}>
        <h1>Testimonials</h1>
        <p>What our customers say about us.</p>
      </div>
    </div>
  )
}
