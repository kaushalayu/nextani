import { generatePageMetadata } from '../../../lib/seo-metadata'

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function generateMetadata({ params }) {
  try {
    const { slug } = await params
    const res = await fetch(`${apiUrl}/api/categories?limit=100`, { next: { revalidate: 60 } })
    if (!res.ok) return {}
    const json = await res.json()
    const cat = (json.categories || []).find((c) => c.slug === slug)
    if (!cat) return {}
    const title = cat.name || slug.replace(/-/g, ' ')
    return generatePageMetadata(
      title,
      cat.description || `Browse our ${title.toLowerCase()} medicines and healthcare products at Painomed.`,
      `/category/${slug}`
    )
  } catch {
    return {}
  }
}

export default function Layout({ children }) {
  return children
}
