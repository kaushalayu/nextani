import { generatePageMetadata } from '../../lib/seo-metadata'

export const metadata = generatePageMetadata(
  'Shopping Cart',
  'Review your selected medicines and healthcare products, then proceed to secure checkout at Painomed.',
  '/cart'
)

export default function Layout({ children }) {
  return children
}
