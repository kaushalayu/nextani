import { generatePageMetadata } from '../../lib/seo-metadata'

export const metadata = generatePageMetadata(
  'Frequently Asked Questions',
  'Find answers to commonly asked questions about Pharmez online pharmacy, ordering, delivery, prescriptions and more.',
  '/faq'
)

export default function FAQ() {
  return (
    <div className="faq-page">
      <div className="container" style={{ padding: '60px 0' }}>
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about our service.</p>
      </div>
    </div>
  )
}
