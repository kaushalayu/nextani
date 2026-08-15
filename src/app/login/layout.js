import { generatePageMetadata } from '../../lib/seo-metadata'

export const metadata = generatePageMetadata(
  'Login to Your Account',
  'Sign in to your Painomed account to manage orders, wishlist and more.',
  '/login'
)

export default function Layout({ children }) {
  return children
}
