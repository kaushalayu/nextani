import { generatePageMetadata } from '../../lib/seo-metadata'

export const metadata = generatePageMetadata(
  'About Us',
  'Learn more about Painomed — your trusted online pharmacy for fast, secure medicine delivery and prescription support.',
  '/about'
)

export default function Layout({ children }) {
  return children
}
