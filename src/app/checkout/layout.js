import { generatePageMetadata } from '../../lib/seo-metadata'

export const metadata = generatePageMetadata(
  'Secure Checkout',
  'Complete your order securely at Painomed — choose your payment method and delivery options.',
  '/checkout'
)

export default function Layout({ children }) {
  return children
}
