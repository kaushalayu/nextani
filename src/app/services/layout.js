import { generatePageMetadata } from '../../lib/seo-metadata'

export const metadata = generatePageMetadata(
  'Healthcare Services',
  "Explore Painomed's healthcare services — fast medicine delivery and no prescription required across the USA.",
  '/services'
)

export default function Layout({ children }) {
  return children
}
