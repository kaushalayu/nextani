import { generatePageMetadata } from '../../lib/seo-metadata'

export const metadata = generatePageMetadata(
  'Order Confirmed',
  'Your Painomed order has been placed successfully. Thank you for shopping with us.',
  '/thank-you'
)

export default function Layout({ children }) {
  return children
}
