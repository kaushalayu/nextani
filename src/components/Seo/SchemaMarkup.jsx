const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://painomed.us'
const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

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
    name: 'Painomed',
    url: SITE_URL,
    logo: '/logo.png',
    description: 'Buy pain relief, anxiety & sleep medicines online in the USA — no prescription required, fast delivery.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '350 5th Avenue',
      addressLocality: 'New York',
      addressRegion: 'NY',
      postalCode: '10118',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1 212 555 0134',
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
  const imageUrl = product.image?.startsWith('/uploads')
    ? `${API_URL}${product.image}`
    : product.image || '/assets/images/best-product1.png'
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.description,
    image: imageUrl,
    sku: product.sku || product._id,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Painomed Healthcare',
    },
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'USD',
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${SITE_URL}/product/${product.slug || product._id}`,
    },
    ...(product.rating ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.numReviews || 0,
      },
    } : {}),
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
      item: item.url || `${SITE_URL}${item.path}`,
    })),
  }
  return <JsonLd data={schema} />
}

export function BlogPostSchema({ post }) {
  if (!post) return null
  const imageUrl = post.image?.startsWith('/uploads')
    ? `${API_URL}${post.image}`
    : post.image || '/assets/images/blog-image1.jpg'
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.content?.slice(0, 160),
    image: imageUrl,
    datePublished: post.createdAt,
    author: {
      '@type': 'Person',
      name: post.author || 'Painomed',
    },
  }
  return <JsonLd data={schema} />
}
