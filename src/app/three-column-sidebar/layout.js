import { generatePageMetadata } from '../../lib/seo-metadata'

export const metadata = {
  ...generatePageMetadata(
    'Products',
    'Browse our product catalog at Painomed.',
    '/three-column-sidebar'
  ),
  robots: { index: false, follow: true },
}

export default function Layout({ children }) {
  return children
}
