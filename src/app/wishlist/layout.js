import { generatePageMetadata } from '../../lib/seo-metadata'

export const metadata = generatePageMetadata(
  'My Wishlist',
  'Your saved medicines and healthcare products at Painomed.',
  '/wishlist'
)

export default function Layout({ children }) {
  return children
}
