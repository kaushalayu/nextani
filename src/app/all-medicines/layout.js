import { generatePageMetadata } from '../../lib/seo-metadata'

export const metadata = generatePageMetadata(
  'All Medicines A–Z',
  'Browse our complete A–Z directory of medicines and healthcare products at Painomed.',
  '/all-medicines'
)

export default function Layout({ children }) {
  return children
}
