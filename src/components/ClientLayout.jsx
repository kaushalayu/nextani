'use client'

import { AuthProvider } from '../context/AuthContext'
import { CartProvider } from '../context/CartContext'
import { WishlistProvider } from '../context/WishlistContext'
import { ToastProvider } from '../components/Toast'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Preloader from '../components/Preloader'
import ErrorBoundary from '../components/ErrorBoundary'
import { GAPageView } from '../components/Seo/GoogleAnalytics'
import { usePathname } from 'next/navigation'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

function BackToTop() {
  const handleClick = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  return <a id="button" className="show" onClick={handleClick} style={{ cursor: 'pointer' }}></a>
}

function SearchOverlay() {
  useEffect(() => {
    const handler = (e) => {
      const href = e.target.closest('a')?.getAttribute('href')
      if (href === '#search') {
        e.preventDefault()
        document.getElementById('search')?.classList.add('open')
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  return (
    <div id="search">
      <span className="close" onClick={() => document.getElementById('search')?.classList.remove('open')}>X</span>
      <form role="search" id="searchform" method="get">
        <input name="q" type="search" placeholder="Type to Search" />
      </form>
    </div>
  )
}

import { useEffect } from 'react'

export default function ClientLayout({ children }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>
              <GAPageView GA_MEASUREMENT_ID={GA_ID} />
              {!isAdmin && <Preloader />}
              {!isAdmin && <BackToTop />}
              {!isAdmin && <SearchOverlay />}
              {!isAdmin && <Header />}
              <main>{children}</main>
              {!isAdmin && <Footer />}
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
