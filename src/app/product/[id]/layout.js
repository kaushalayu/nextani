import { generateProductMetadata } from '../../../lib/seo-metadata'

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function generateMetadata({ params }) {
  try {
    const { id } = await params
    const res = await fetch(`${apiUrl}/api/products/${id}`, { next: { revalidate: 60 } })
    if (!res.ok) return {}
    const json = await res.json()
    return generateProductMetadata(json.product)
  } catch {
    return {}
  }
}

export default function Layout({ children }) {
  return children
}
