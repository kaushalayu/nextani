import { generatePageMetadata } from '../../lib/seo-metadata'

export const metadata = generatePageMetadata(
  'Health & Wellness Blog',
  'Read our latest health and wellness articles, medicine guides and pharmacy tips at Painomed.',
  '/blog'
)

export default function Layout({ children }) {
  return children
}
