const API_URL = process.env.NEXT_PUBLIC_API_URL
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

if (!API_URL) console.error('NEXT_PUBLIC_API_URL is not set — sitemap product/blog URLs may fail')
if (!siteUrl) console.error('NEXT_PUBLIC_SITE_URL is not set — sitemap URLs will be relative')

const STATIC_PAGES = [
  { url: siteUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
  { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  { url: `${siteUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${siteUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${siteUrl}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${siteUrl}/testimonials`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  { url: `${siteUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  { url: `${siteUrl}/terms-of-use`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  { url: `${siteUrl}/new-arrivals`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${siteUrl}/best-sellers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${siteUrl}/painkillers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${siteUrl}/sleeping-pills`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${siteUrl}/anxiety`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${siteUrl}/all-medicines`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  { url: `${siteUrl}/coming-soon`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
]

export default async function sitemap() {
  if (!API_URL || !siteUrl) return STATIC_PAGES

  let dynamicUrls = []

  try {
    const res = await fetch(`${API_URL}/api/products?limit=1000&isActive=true`)
    const data = await res.json()
    const products = data.products || []
    products.forEach(p => {
      dynamicUrls.push({
        url: `${siteUrl}/product/${p.slug || p._id}`,
        lastModified: new Date(p.updatedAt || p.createdAt || Date.now()),
        changeFrequency: 'weekly',
        priority: 0.9,
      })
    })
  } catch (e) {
    console.error('Sitemap: Failed to fetch products', e.message)
  }

  try {
    const blogRes = await fetch(`${API_URL}/api/blogs?limit=100`)
    const blogData = await blogRes.json()
    const blogs = blogData.blogs || []
    blogs.forEach(b => {
      dynamicUrls.push({
        url: `${siteUrl}/blog/${b.slug || b._id}`,
        lastModified: new Date(b.updatedAt || b.createdAt || Date.now()),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    })
  } catch (e) {
    console.error('Sitemap: Failed to fetch blogs', e.message)
  }

  return [...STATIC_PAGES, ...dynamicUrls]
}
