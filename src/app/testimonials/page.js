import { generatePageMetadata } from '../../lib/seo-metadata'

export const metadata = generatePageMetadata(
  'Testimonials',
  'Read what our customers say about Pharmez. Real reviews from real customers who trust us for their medicine delivery needs.',
  '/testimonials'
)

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
