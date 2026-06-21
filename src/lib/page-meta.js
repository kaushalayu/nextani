const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`

export async function getPageMeta(page) {
  try {
    const res = await fetch(`${API_URL}/page-meta/${encodeURIComponent(page)}`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    const json = await res.json()
    return json.data || null
  } catch {
    return null
  }
}

export function buildMetadata(meta, fallbackTitle, fallbackDescription) {
  if (!meta || (!meta.title && !meta.description)) return null
  const title = meta.title || fallbackTitle
  const description = meta.description || fallbackDescription
  return {
    title,
    description,
    keywords: meta.keywords || undefined,
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: 'Pharmez',
      ...(meta.ogImage ? { images: [{ url: meta.ogImage.startsWith('http') ? meta.ogImage : `${process.env.NEXT_PUBLIC_API_URL}${meta.ogImage}`, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(meta.ogImage ? { images: [meta.ogImage.startsWith('http') ? meta.ogImage : `${process.env.NEXT_PUBLIC_API_URL}${meta.ogImage}`] } : {}),
    },
    alternates: { canonical: `${SITE_URL}${meta.page || '/'}` },
  }
}
