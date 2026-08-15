import { generatePageMetadata } from '../../lib/seo-metadata'

export const metadata = generatePageMetadata(
  'Shop Medicines & Healthcare Products Online',
  "Browse Painomed's wide range of medicines and healthcare products online. Secure checkout, discreet packaging and fast delivery.",
  '/shop'
)

export default function Layout({ children }) {
  return children
}
