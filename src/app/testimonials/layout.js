import { generatePageMetadata } from '../../lib/seo-metadata'

export const metadata = generatePageMetadata(
  'Customer Reviews & Testimonials',
  "Read what our customers say about Painomed's medicines, delivery and service.",
  '/testimonials'
)

export default function Layout({ children }) {
  return children
}
