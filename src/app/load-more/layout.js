import { generatePageMetadata } from '../../lib/seo-metadata'

export const metadata = {
  ...generatePageMetadata(
    'Shop All Products',
    'Browse all Painomed products with load more functionality.',
    '/load-more'
  ),
  robots: { index: false, follow: true },
}

export default function Layout({ children }) {
  return children
}
