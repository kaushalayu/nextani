import { generatePageMetadata } from '../../lib/seo-metadata'

export const metadata = generatePageMetadata(
  'Frequently Asked Questions',
  'Answers to frequently asked questions about ordering, prescription, delivery and payments at Painomed.',
  '/faq'
)

export default function Layout({ children }) {
  return children
}
