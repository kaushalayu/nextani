import { generatePageMetadata } from '../../lib/seo-metadata'

export const metadata = generatePageMetadata(
  'My Orders & Account',
  'Track your orders and manage your Painomed account profile.',
  '/profile'
)

export default function Layout({ children }) {
  return children
}
