import { generatePageMetadata } from '../../lib/seo-metadata'

export const metadata = generatePageMetadata(
  'Our Services',
  'Explore Pharmez services: prescription upload, medicine delivery, health consultations, and more. Your health, our priority.',
  '/services'
)

export default function Services() {
  return (
    <div className="services-page">
      <div className="container" style={{ padding: '60px 0' }}>
        <h1>Our Services</h1>
        <p>We offer a range of healthcare services to meet your needs.</p>
      </div>
    </div>
  )
}
