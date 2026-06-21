import { generatePageMetadata } from '../../lib/seo-metadata'
import { getPageMeta, buildMetadata } from '../../lib/page-meta'

export async function generateMetadata() {
  const meta = await getPageMeta('/terms-of-use')
  return buildMetadata(meta, 'Terms of Use', 'Read the terms and conditions for using Pharmez online pharmacy services, including ordering, delivery, and prescription policies.') || generatePageMetadata(
    'Terms of Use',
    'Read the terms and conditions for using Pharmez online pharmacy services, including ordering, delivery, and prescription policies.',
    '/terms-of-use'
  )
}

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
