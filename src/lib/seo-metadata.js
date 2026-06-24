const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
const siteName = 'Painomed - Online Pharmacy'

const metadataBase = siteUrl ? new URL(siteUrl) : undefined

export const defaultMetadata = {
  title: {
    default: 'Painomed - Online Pharmacy | Fast & Trusted Medicine Delivery',
    template: '%s | Painomed',
  },
  description: 'Painomed is your trusted online pharmacy. Upload your prescription & get medicines delivered to your doorstep. Safe, reliable & always on time.',
  keywords: ['online pharmacy', 'medicine delivery', 'prescription', 'healthcare', 'pharmacy', 'Painomed'],
  ...(metadataBase && { metadataBase }),
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName,
    title: 'Painomed - Online Pharmacy',
    description: 'Fast & trusted medicine delivery. Upload prescription & get medicines delivered.',
    ...(siteUrl && { url: siteUrl }),
    images: [{ url: '/assets/images/logo.png', width: 200, height: 60, alt: 'Painomed' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Painomed - Online Pharmacy',
    description: 'Fast & trusted medicine delivery. Upload prescription & get medicines delivered.',
    images: ['/assets/images/logo.png'],
    creator: '@painomed',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  ...(siteUrl && { alternates: { canonical: siteUrl } }),
}

export function generateProductMetadata(product) {
  if (!product) return {}
  const url = siteUrl ? `${siteUrl}/product/${product.slug || product._id}` : ''
  const price = product.hasPillsOptions && product.pillsOptions?.[0]
    ? product.pillsOptions[0].price
    : product.price || 0
  const img = product.image?.startsWith('/uploads')
    ? `${process.env.NEXT_PUBLIC_API_URL}${product.image}`
    : product.image || '/assets/images/best-product1.png'

  return {
    title: `${product.name} - Buy Online | Painomed`,
    description: product.shortDescription || product.description?.slice(0, 160) || `Buy ${product.name} online at Painomed. Best price $${price}. Fast delivery.`,
    keywords: [product.name, product.badge, 'online pharmacy', 'buy medicine'].filter(Boolean),
    openGraph: {
      title: `${product.name} | Painomed`,
      description: product.shortDescription || `Buy ${product.name} online. $${price}.`,
      ...(url && { url }),
      images: [{ url: img, width: 800, height: 800, alt: product.name }],
    },
    twitter: {
      title: `${product.name} | Painomed`,
      description: product.shortDescription || `Buy ${product.name} online. $${price}.`,
      images: [img],
    },
    ...(url && { alternates: { canonical: url } }),
  }
}

export function generateBlogMetadata(post) {
  if (!post) return {}
  const url = siteUrl ? `${siteUrl}/blog/${post.slug || post._id}` : ''
  const img = post.image?.startsWith('/uploads')
    ? `${process.env.NEXT_PUBLIC_API_URL}${post.image}`
    : post.image || '/assets/images/blog-image1.jpg'

  return {
    title: `${post.title} | Painomed Blog`,
    description: post.excerpt || post.content?.slice(0, 160) || 'Read our latest blog post.',
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content?.slice(0, 160),
      ...(url && { url }),
      type: 'article',
      publishedTime: post.createdAt,
      images: [{ url: img, width: 800, height: 400, alt: post.title }],
    },
    twitter: {
      title: post.title,
      description: post.excerpt || post.content?.slice(0, 160),
      images: [img],
    },
    ...(url && { alternates: { canonical: url } }),
  }
}

export function generatePageMetadata(title, description, path, ogImage) {
  const url = siteUrl ? `${siteUrl}${path}` : ''
  return {
    title,
    description,
    openGraph: {
      title: `${title} | Painomed`,
      description,
      ...(url && { url }),
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      title: `${title} | Painomed`,
      description,
    },
    ...(url && { alternates: { canonical: url } }),
  }
}
