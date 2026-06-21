import Script from 'next/script'

export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Pharmacy',
    name: 'Pharmez',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    logo: '/assets/images/logo.png',
    description: 'Fast & trusted medicine delivery. Upload prescription & get medicines delivered.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '21 King Street',
      addressLocality: 'Melbourne',
      addressRegion: 'VIC',
      postalCode: '3000',
      addressCountry: 'AU',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+61 3 8376 6284',
      contactType: 'customer service',
    },
    sameAs: [
      'https://www.facebook.com/',
      'https://instagram.com/',
      'https://www.linkedin.com/',
    ],
  }
  return <JsonLd data={schema} />
}

export function ProductSchema({ product }) {
  if (!product) return null
  const price = product.hasPillsOptions && product.pillsOptions?.[0]
    ? product.pillsOptions[0].price
    : product.price || 0
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.description,
    image: product.image?.startsWith('/uploads')
      ? `${process.env.NEXT_PUBLIC_API_URL}${product.image}`
      : product.image || '/assets/images/best-product1.png',
    sku: product.sku || product._id,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Pharmez Healthcare',
    },
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.numReviews || 0,
    } : undefined,
  }
  return <JsonLd data={schema} />
}

export function BreadcrumbSchema({ items }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${item.path}`,
    })),
  }
  return <JsonLd data={schema} />
}

export function BlogPostSchema({ post }) {
  if (!post) return null
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.content?.slice(0, 160),
    image: post.image?.startsWith('/uploads')
      ? `${process.env.NEXT_PUBLIC_API_URL}${post.image}`
      : post.image || '/assets/images/blog-image1.jpg',
    datePublished: post.createdAt,
    author: {
      '@type': 'Person',
      name: post.author || 'Pharmez',
    },
  }
  return <JsonLd data={schema} />
}
