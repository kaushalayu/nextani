import { generatePageMetadata } from '../../lib/seo-metadata'

export const metadata = generatePageMetadata(
  'New Arrivals',
  'Discover the latest additions to Painomed — fresh stock and new formulas, updated regularly.',
  '/new-arrivals'
)

export default function Layout({ children }) {
  return children
}
