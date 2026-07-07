const API_URL = process.env.NEXT_PUBLIC_API_URL
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://painomed.us'

if (!API_URL) console.error('NEXT_PUBLIC_API_URL is not set — sitemap product/blog URLs may fail')
if (!process.env.NEXT_PUBLIC_SITE_URL) console.warn('NEXT_PUBLIC_SITE_URL not set, using https://painomed.us as fallback')

const buildUrl = (path) => `${SITE_URL}${path}`

const STATIC_PAGES = [
  { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
  { url: buildUrl('/about'), lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  { url: buildUrl('/shop'), lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  { url: buildUrl('/blog'), lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: buildUrl('/contact'), lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  { url: buildUrl('/faq'), lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  { url: buildUrl('/services'), lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  { url: buildUrl('/testimonials'), lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  { url: buildUrl('/privacy-policy'), lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  { url: buildUrl('/terms-of-use'), lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  { url: buildUrl('/new-arrivals'), lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: buildUrl('/best-sellers'), lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: buildUrl('/painkillers'), lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: buildUrl('/sleeping-pills'), lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: buildUrl('/anxiety'), lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: buildUrl('/all-medicines'), lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
]

async function fetchWithTimeout(url, timeoutMs = 8000) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { signal: controller.signal })
    return await res.json()
  } finally {
    clearTimeout(id)
  }
}

export default async function sitemap() {
  const dynamicUrls = []

  if (!API_URL) return STATIC_PAGES

  try {
    const data = await fetchWithTimeout(`${API_URL}/api/products?limit=1000&isActive=true`)
    const products = data.products || []
    products.forEach(p => {
      dynamicUrls.push({
        url: buildUrl(`/product/${p.slug || p._id}`),
        lastModified: new Date(p.updatedAt || p.createdAt || Date.now()),
        changeFrequency: 'weekly',
        priority: 0.9,
      })
    })
  } catch (e) {
    console.error('Sitemap: Failed to fetch products', e.message)
  }

  try {
    const data = await fetchWithTimeout(`${API_URL}/api/blogs?limit=100`)
    const blogs = data.blogs || []
    blogs.forEach(b => {
      dynamicUrls.push({
        url: buildUrl(`/blog/${b.slug || b._id}`),
        lastModified: new Date(b.updatedAt || b.createdAt || Date.now()),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    })
  } catch (e) {
    console.error('Sitemap: Failed to fetch blogs', e.message)
  }

  try {
    const data = await fetchWithTimeout(`${API_URL}/api/categories?limit=100`)
    const categories = data.categories || []
    categories.forEach(c => {
      dynamicUrls.push({
        url: buildUrl(`/category/${c.slug || c._id}`),
        lastModified: new Date(c.updatedAt || c.createdAt || Date.now()),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    })
  } catch (e) {
    console.error('Sitemap: Failed to fetch categories', e.message)
  }

  return [...STATIC_PAGES, ...dynamicUrls]
}
