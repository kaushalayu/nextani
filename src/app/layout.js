import { Geist, Geist_Mono } from 'next/font/google'
import ClientLayout from '../components/ClientLayout'
import { OrganizationSchema } from '../components/Seo/SchemaMarkup'
import { GoogleAnalytics } from '../components/Seo/GoogleAnalytics'
import './globals.css'
import './home.css'
import '../components/MegaMenu.css'
import './shop/shop.css'
import './about/about.css'
import './contact/contact.css'
import './login/login.css'
import './services/services.css'
import './product/product.css'
import './blog/blog-detail.css'
import './wishlist/wishlist.css'
import './profile/profile.css'
import './cart/cart.css'
import './checkout/checkout.css'
import './my-orders/orders.css'
import './testimonials/testimonials.css'
import './join-now/join.css'
import './coming-soon/coming-soon.css'
import './thank-you/thank-you.css'
import './faq/faq.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

async function fetchSeoData() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    const res = await fetch(`${apiUrl}/api/seo`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    const json = await res.json()
    return json.seo || null
  } catch {
    return null
  }
}

export async function generateMetadata() {
  const seo = await fetchSeoData()
  const siteTitle = seo?.siteTitle || 'Painomed - Online Pharmacy'
  const siteDescription = seo?.siteDescription || 'Painomed is your trusted online pharmacy. Upload your prescription & get medicines delivered to your doorstep. Safe, reliable & always on time.'
  const siteKeywords = seo?.siteKeywords || 'online pharmacy, medicine delivery, painomed'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
  const metadataBase = siteUrl ? new URL(siteUrl) : undefined
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
  const ogImage = seo?.ogImage
    ? seo.ogImage.startsWith('http') ? seo.ogImage : `${apiUrl}${seo.ogImage}`
    : '/logo.png'

  const siteShort = siteTitle.replace(/ - .*$/, '').trim() || 'Painomed'

  return {
    title: {
      default: siteTitle,
      template: `%s | ${siteShort}`,
    },
    description: siteDescription,
    keywords: siteKeywords.split(',').map(k => k.trim()).filter(Boolean),
    ...(metadataBase && { metadataBase }),
    icons: {
      icon: seo?.siteIcon || '/favicon.svg',
      apple: seo?.siteIcon || '/favicon.svg',
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: 'Painomed',
      title: seo?.ogTitle || siteTitle,
      description: seo?.ogDescription || siteDescription,
      ...(siteUrl && { url: siteUrl }),
      images: [{ url: ogImage, width: 200, height: 60, alt: 'Painomed' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.ogTitle || siteTitle,
      description: seo?.ogDescription || siteDescription,
      images: [ogImage],
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
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        <link href="/assets/bootstrap/bootstrap.min.css" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet" />
        <link href="/assets/css/style.css" rel="stylesheet" type="text/css" />
        <link href="/assets/css/responsive.css" rel="stylesheet" type="text/css" />
        <link href="/assets/css/owl.carousel.min.css" rel="stylesheet" type="text/css" />
        <link href="/assets/css/owl.theme.default.min.css" rel="stylesheet" type="text/css" />
        <link href="/assets/css/custom.css" rel="stylesheet" type="text/css" />
        <link href="/assets/css/animate.css" rel="stylesheet" type="text/css" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/magnific-popup.css" rel="stylesheet" />
        <link href="/assets/css/shop.css" rel="stylesheet" type="text/css" />
        <link href="/assets/css/blog.css" rel="stylesheet" type="text/css" />
        <OrganizationSchema />
        <GoogleAnalytics GA_MEASUREMENT_ID={GA_ID} />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
