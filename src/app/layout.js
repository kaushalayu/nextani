import { Geist, Geist_Mono } from 'next/font/google'
import ClientLayout from '../components/ClientLayout'
import { OrganizationSchema } from '../components/Seo/SchemaMarkup'
import { GoogleAnalytics } from '../components/Seo/GoogleAnalytics'
import { defaultMetadata } from '../lib/seo-metadata'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata = defaultMetadata

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
