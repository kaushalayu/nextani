import { generatePageMetadata } from '../../lib/seo-metadata'
import SubBanner from '../../components/SubBanner'

export const metadata = generatePageMetadata('Terms of Use', 'Read the terms and conditions for using Pharmez online pharmacy services, including ordering, delivery, and prescription policies.', '/terms-of-use')

export default function TermsOfUse() {
  return (
    <>
      <SubBanner title="Terms of Use" description="Read the terms and conditions for using Pharmez online pharmacy services, including ordering, delivery, and prescription policies." page="Terms of Use" />
      <div className="padding-rl float-left w-100">
        <div className="container legal-content">
          <h2>Acceptance of Terms</h2>
          <p>By accessing and using Pharmez website, you agree to comply with and be bound by these Terms of Use. If you do not agree with any part of these terms, please do not use our services.</p>
          <h2>Products and Services</h2>
          <p>All products and services listed on our website are subject to availability. We reserve the right to modify or discontinue any product without prior notice.</p>
          <h2>Prescription Requirements</h2>
          <p>Certain medications require a valid prescription from a licensed healthcare provider. By ordering such products, you confirm that you have a valid prescription.</p>
          <h2>Pricing and Payment</h2>
          <p>All prices are listed in the currency specified on the website. We reserve the right to modify prices at any time. Payment must be received in full before orders are processed.</p>
          <h2>Shipping and Delivery</h2>
          <p>Delivery times are estimates and may vary. We are not responsible for delays caused by external factors such as customs, weather, or carrier issues.</p>
          <h2>Limitation of Liability</h2>
          <p>Pharmez shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or services.</p>
          <h2>Changes to Terms</h2>
          <p>We reserve the right to update these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms.</p>
        </div>
      </div>
    </>
  )
}
