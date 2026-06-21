import { generatePageMetadata } from '../../lib/seo-metadata'

export const metadata = generatePageMetadata(
  'Contact Us',
  'Get in touch with Pharmez. Contact our support team for inquiries about orders, prescriptions, deliveries, or general questions.',
  '/contact'
)

export default function Contact() {
  return (
    <div className="contact-page">
      <div className="container" style={{ padding: '60px 0' }}>
        <h1>Contact Us</h1>
        <p>Get in touch with our support team.</p>
      </div>
    </div>
  )
}
