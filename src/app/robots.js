const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/checkout/', '/my-orders/', '/profile/', '/thank-you/'],
      },
    ],
    sitemap: siteUrl ? `${siteUrl}/sitemap.xml` : undefined,
    host: siteUrl || undefined,
  }
}
