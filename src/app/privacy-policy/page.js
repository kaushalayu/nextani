import { generatePageMetadata } from '../../lib/seo-metadata'

export const metadata = generatePageMetadata(
  'Privacy Policy',
  'Pharmez privacy policy outlines how we collect, use, and protect your personal information when using our online pharmacy services.',
  '/privacy-policy'
)

export default function PrivacyPolicy() {
  return (
    <div className="privacy-page">
      <div className="container" style={{ padding: '60px 0' }}>
        <h1>Privacy Policy</h1>
        <p>Our privacy policy outlines how we collect, use, and protect your personal information.</p>
      </div>
    </div>
  )
}
