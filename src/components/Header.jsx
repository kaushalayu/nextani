'use client'

import { useState, useRef, useEffect, memo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCart } from '../context/CartContext'
import API from '../lib/api'

const CAT_COLORS = ['#6366f1', '#0f766e', '#7c3aed', '#d97706', '#dc2626', '#0891b2', '#4f46e5', '#059669']

// Map known category names → existing page paths
const CAT_PAGE_MAP = {
  'sleeping pills': '/sleeping-pills',
  'painkillers':    '/painkillers',
  'anxiety pills':  '/anxiety',
}

// Map known category names → badge value for product fetching
const BADGE_MAP = {
  'sleeping pills': 'sleep aid',
  'painkillers':    'painkiller',
  'anxiety pills':  'calm',
}

function ProductMegaMenu() {
  const [open, setOpen]               = useState(false)
  const [activeIdx, setActiveIdx]     = useState(0)
  const [products, setProducts]       = useState({})
  const [categories, setCategories]   = useState([])
  const [loadingCat, setLoadingCat]   = useState(true)
  const [fetching, setFetching]       = useState(null)
  const menuRef = useRef(null)
  const closeTimer = useRef(null)

  useEffect(() => {
    API.get('/categories?limit=100')
      .then(({ data }) => setCategories(data.categories || []))
      .catch(() => {})
      .finally(() => setLoadingCat(false))
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const fetchCategoryProducts = async (catId, catName) => {
    if (products[catId]) return
    setFetching(catId)
    const key = catName.toLowerCase().trim()
    const badgeVal = BADGE_MAP[key]
    const params = badgeVal
      ? `badge=${encodeURIComponent(badgeVal)}`
      : `category=${catId}`
    try {
      const { data } = await API.get(`/products?${params}&limit=50&isActive=true&sort=name`)
      setProducts(prev => ({ ...prev, [catId]: data.products || [] }))
    } catch {
      setProducts(prev => ({ ...prev, [catId]: [] }))
    } finally {
      setFetching(null)
    }
  }

  const getCatPath = (cat) => {
    const key = cat.name.toLowerCase().trim()
    return CAT_PAGE_MAP[key] || `/category/${cat.slug}`
  }

  const handleMouseEnterTrigger = () => {
    clearTimeout(closeTimer.current)
    setOpen(true)
    if (categories.length > 0 && !products[categories[0]._id]) {
      fetchCategoryProducts(categories[0]._id, categories[0].name)
    }
  }

  const handleMouseLeaveTrigger = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 200)
  }

  const handleMouseEnterMenu = () => clearTimeout(closeTimer.current)

  const handleMouseLeaveMenu = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 200)
  }

  const handleCategoryHover = (idx) => {
    setActiveIdx(idx)
    const cat = categories[idx]
    if (cat) fetchCategoryProducts(cat._id, cat.name)
  }

  const activeCat  = categories[activeIdx]
  const catList    = activeCat ? (products[activeCat._id] || []) : []
  const isLoading  = activeCat && fetching === activeCat._id

  if (loadingCat) return null

  return (
    <li className="nav-item dropdown mega-product-nav" ref={menuRef}
      onMouseEnter={handleMouseEnterTrigger}
      onMouseLeave={handleMouseLeaveTrigger}>
      <span className="nav-link p-0 dropdown-toggle" style={{ cursor: 'pointer' }}>
        Product
      </span>
      {open && activeCat && (
        <div className="mega-panel" onMouseEnter={handleMouseEnterMenu} onMouseLeave={handleMouseLeaveMenu}>
          <div className="mega-panel__left">
            <p className="mega-panel__heading">Categories</p>
            {categories.map((cat, idx) => (
              <div key={cat._id} className={`mega-cat-item${activeIdx === idx ? ' active' : ''}`}
                style={{ '--cat-color': CAT_COLORS[idx % CAT_COLORS.length] }}
                onMouseEnter={() => handleCategoryHover(idx)}
                onClick={() => setOpen(false)}>
                <Link href={getCatPath(cat)} className="mega-cat-item__link">
                  <span className="mega-cat-item__dot" />
                  {cat.name}
                  <i className="fa-solid fa-chevron-right mega-cat-item__arrow" />
                </Link>
              </div>
            ))}
          </div>
          <div className="mega-panel__right" style={{ '--cat-color': CAT_COLORS[activeIdx % CAT_COLORS.length] }}>
            <div className="mega-panel__right-header">
              <p className="mega-panel__heading">{activeCat.name}</p>
              <Link href={getCatPath(activeCat)} className="mega-panel__view-all" onClick={() => setOpen(false)}>
                View All <i className="fa-solid fa-arrow-right" />
              </Link>
            </div>
            {!activeCat ? (
              <div className="mega-products-empty">
                <i className="fa-solid fa-box-open" />
                <span>Select a category</span>
              </div>
            ) : isLoading ? (
              <div className="mega-products-loading">
                <i className="fa-solid fa-spinner fa-spin" />
                <span>Loading...</span>
              </div>
            ) : catList.length === 0 ? (
              <div className="mega-products-empty">
                <i className="fa-solid fa-box-open" />
                <span>No products yet.<br />Add from Admin Panel.</span>
              </div>
            ) : (
              <div className="mega-products-list">
                {catList.map((p) => (
                  <Link key={p._id} href={`/product/${p.slug || p._id}`}
                    className="mega-product-link" onClick={() => setOpen(false)}>
                    {p.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </li>
  )
}

function Header() {
  const { cart } = useCart()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [mobileSearch, setMobileSearch] = useState('')

  const closeMobileNav = () => setMobileNavOpen(false)

  const handleMobileSearch = (e) => {
    e.preventDefault()
    if (!mobileSearch.trim()) return
    router.push(`/shop?search=${encodeURIComponent(mobileSearch.trim())}`)
    setMobileSearch('')
    closeMobileNav()
  }

  useEffect(() => { setMobileNavOpen(false) }, [pathname])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 992) setMobileNavOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div className="padding-rl float-left w-100">
      <header className="w-100 float-left header-con position-relative main-box">
        <div className="container-fluid">
          <nav className="navbar navbar-expand-lg navbar-light">
            <Link className="navbar-brand" href="/">
              <figure className="mb-0">
                <img loading="lazy" src="/logo.png" alt="Painomed Logo" />
              </figure>
            </Link>
            <button className={`navbar-toggler collapsed${mobileNavOpen ? '' : ' collapsed'}`}
              type="button" onClick={() => setMobileNavOpen(v => !v)}
              aria-controls="navbarSupportedContent" aria-expanded={mobileNavOpen}
              aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" />
              <span className="navbar-toggler-icon" />
              <span className="navbar-toggler-icon" />
            </button>
            <div className={`collapse navbar-collapse${mobileNavOpen ? ' show' : ''}`} id="navbarSupportedContent">
              <ul className="navbar-nav m-auto">
                <li className="nav-item mr-0">
                  <Link className={`nav-link p-0${pathname === '/' ? ' active' : ''}`} href="/" onClick={closeMobileNav}>Home</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link p-0${pathname === '/about' ? ' active' : ''}`} href="/about" onClick={closeMobileNav}>About</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link p-0${pathname === '/shop' ? ' active' : ''}`} href="/shop" onClick={closeMobileNav}>Shop</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link p-0${pathname === '/services' ? ' active' : ''}`} href="/services" onClick={closeMobileNav}>Service</Link>
                </li>
                <ProductMegaMenu />
                <li className="nav-item">
                  <Link className={`nav-link p-0${pathname === '/all-medicines' ? ' active' : ''}`} href="/all-medicines" onClick={closeMobileNav}>All Medicines</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link p-0${pathname === '/faq' ? ' active' : ''}`} href="/faq" onClick={closeMobileNav}>FAQ</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link p-0${pathname.startsWith('/blog') ? ' active' : ''}`} href="/blog" onClick={closeMobileNav}>Blog</Link>
                </li>
                <li className="nav-item mobile-search-item">
                  <form onSubmit={handleMobileSearch} className="mobile-search-form">
                    <input
                      type="text"
                      value={mobileSearch}
                      onChange={e => setMobileSearch(e.target.value)}
                      placeholder="Search medicines..."
                      className="mobile-search-input"
                    />
                    <button type="submit" className="mobile-search-btn" aria-label="Search">
                      <i className="fa-solid fa-magnifying-glass" />
                    </button>
                  </form>
                </li>
                <li className="nav-item mobile-login-item">
                  <Link className="nav-link p-0" href="/profile" onClick={closeMobileNav}>
                    <i className="fa-solid fa-user" /> My Orders
                  </Link>
                </li>
              </ul>
            </div>
            <div className="header-contact d-flex align-items-center">
              <div className="last_list">
                <a className="search ml-0" href="#search">
                  <img loading="lazy" src="/assets/images/header-search.png" alt="Search" />
                </a>
                <Link className="cart" href="/wishlist" title="Wishlist">
                  <i className="fa-regular fa-heart" style={{ fontSize: 20, color: '#0f0200' }} />
                </Link>
                <Link className="cart" href="/cart" title="Cart">
                  <img loading="lazy" src="/assets/images/header-cart.png" alt="Cart" />
                  {cart.length > 0 && <span>{cart.length}</span>}
                </Link>
                <Link className="admin mr-0" href="/login" title="Admin Login">
                  <img loading="lazy" src="/assets/images/header-admin.png" alt="Admin" />
                </Link>
              </div>
              <ul className="list-unstyled mb-0">
                <li className="d-inline-block">
                  <Link href="/contact" className="contact-btn d-inline-block">Contact Us</Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>
    </div>
  )
}

export default memo(Header)

