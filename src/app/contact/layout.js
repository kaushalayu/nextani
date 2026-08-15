import { generatePageMetadata } from '../../lib/seo-metadata'

export const metadata = generatePageMetadata(
  'Contact Us',
  'Get in touch with Painomed. Our 24/7 support team is here to help with orders, prescriptions and products.',
  '/contact'
)

export default function Layout({ children }) {
  return children
}
