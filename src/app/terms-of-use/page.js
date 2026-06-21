import { generatePageMetadata } from '../../lib/seo-metadata'

export const metadata = generatePageMetadata(
  'Terms of Use',
  'Read the terms and conditions for using Pharmez online pharmacy services, including ordering, delivery, and prescription policies.',
  '/terms-of-use'
)

export default function TermsOfUse() {
  return (
    <div className="terms-page">
      <div className="container" style={{ padding: '60px 0' }}>
        <h1>Terms of Use</h1>
        <p>Please read these terms carefully before using our service.</p>
      </div>
    </div>
  )
}
