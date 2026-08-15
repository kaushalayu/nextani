import { generatePageMetadata } from '../../lib/seo-metadata'

export const metadata = generatePageMetadata(
  'Best Sellers',
  'Our most popular medicines and healthcare products, trusted by thousands of customers — shop Painomed best sellers today.',
  '/best-sellers'
)

export default function Layout({ children }) {
  return children
}
