const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://painomed.us'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/checkout/', '/my-orders/', '/profile/', '/thank-you/'],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
