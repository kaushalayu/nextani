'use client'

import { useState, useRef, useEffect, memo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import API from '../lib/api'

const CATEGORIES = [
  { label: 'Sleeping Pills', path: '/sleeping-pills', badge: 'sleep aid', color: '#6366f1' },
  { label: 'Painkillers',    path: '/painkillers',    badge: 'painkiller', color: '#0f766e' },
  { label: 'Anxiety Pills',  path: '/anxiety',        badge: 'calm',        color: '#7c3aed' },
]

function ProductMegaMenu() {
  const [open, setOpen]               = useState(false)
  const [activeIdx, setActiveIdx]     = useState(0)
  const [products, setProducts]       = useState({})
  const [loadingBadge, setLoadingBadge] = useState(null)
  const menuRef = useRef(null)
  const closeTimer = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const fetchCategoryProducts = async (badge) => {
    if (products[badge]) return
    setLoadingBadge(badge)
    try {
      const { data } = await API.get(`/products?badge=${encodeURIComponent(badge)}&limit=8&isActive=true`)
      setProducts(prev => ({ ...prev, [badge]: data.products || [] }))
    } catch {
      setProducts(prev => ({ ...prev, [badge]: [] }))
    } finally {
      setLoadingBadge(null)
    }
  }

  const handleMouseEnterTrigger = () => {
    clearTimeout(closeTimer.current)
    setOpen(true)
    fetchCategoryProducts(CATEGORIES[activeIdx].badge)
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
    fetchCategoryProducts(CATEGORIES[idx].badge)
  }

  const activeCat   = CATEGORIES[activeIdx]
  const catProducts = products[activeCat.badge] || []
  const isLoading   = loadingBadge === activeCat.badge

  const getImg = (img) => {
    if (!img) return '/assets/images/best-product1.png'
    if (img.startsWith('/uploads')) return `${process.env.NEXT_PUBLIC_API_URL}${img}`
    return img
  }

  return (
    <li className="nav-item dropdown mega-product-nav" ref={menuRef}
      onMouseEnter={handleMouseEnterTrigger}
      onMouseLeave={handleMouseLeaveTrigger}>
      <span className="nav-link p-0 dropdown-toggle" style={{ cursor: 'pointer' }}>
        Product
      </span>
      {open && (
        <div className="mega-panel" onMouseEnter={handleMouseEnterMenu} onMouseLeave={handleMouseLeaveMenu}>
          <div className="mega-panel__left">
            <p className="mega-panel__heading">Categories</p>
            {CATEGORIES.map((cat, idx) => (
              <div key={cat.path} className={`mega-cat-item${activeIdx === idx ? ' active' : ''}`}
                style={{ '--cat-color': cat.color }}
                onMouseEnter={() => handleCategoryHover(idx)}
                onClick={() => setOpen(false)}>
                <Link href={cat.path} className="mega-cat-item__link">
                  <span className="mega-cat-item__dot" />
                  {cat.label}
                  <i className="fa-solid fa-chevron-right mega-cat-item__arrow" />
                </Link>
              </div>
            ))}
          </div>
          <div className="mega-panel__right" style={{ '--cat-color': activeCat.color }}>
            <div className="mega-panel__right-header">
              <p className="mega-panel__heading">{activeCat.label}</p>
              <Link href={activeCat.path} className="mega-panel__view-all" onClick={() => setOpen(false)}>
                View All <i className="fa-solid fa-arrow-right" />
              </Link>
            </div>
            {isLoading ? (
              <div className="mega-products-loading">
                <i className="fa-solid fa-spinner fa-spin" />
                <span>Loading...</span>
              </div>
            ) : catProducts.length === 0 ? (
              <div className="mega-products-empty">
                <i className="fa-solid fa-box-open" />
                <span>No products yet.<br />Add from Admin Panel.</span>
              </div>
            ) : (
              <div className="mega-products-grid">
                {catProducts.map((p) => {
                  const price = p.hasPillsOptions && p.pillsOptions?.[0]
                    ? p.pillsOptions[0].price : p.price || 0
                  return (
                    <Link key={p._id} href={`/product/${p.slug || p._id}`}
                      className="mega-product-card" onClick={() => setOpen(false)}>
                      <div className="mega-product-card__img">
                        <img loading="lazy" src={getImg(p.image)} alt={p.name} />
                      </div>
                      <div className="mega-product-card__info">
                        <span className="mega-product-card__name">{p.name}</span>
                        <span className="mega-product-card__price">${price.toFixed(2)}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </li>
  )
}

function Header() {
  const { isLoggedIn, user, logout } = useAuth()
  const { cart } = useCart()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)
  const [mobileSearch, setMobileSearch] = useState('')

  const closeMobileNav = () => setMobileNavOpen(false)

  const handleMobileSearch = (e) => {
    e.preventDefault()
    if (!mobileSearch.trim()) return
    router.push(`/shop?search=${encodeURIComponent(mobileSearch.trim())}`)
    setMobileSearch('')
    closeMobileNav()
  }

  const handleLogout = () => {
    setUserMenuOpen(false)
    logout()
    router.push('/')
  }

  useEffect(() => { setMobileNavOpen(false) }, [pathname])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 992) setMobileNavOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

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
                  {isLoggedIn ? (
                    <Link className="nav-link p-0 mobile-profile-link" href="/profile" onClick={closeMobileNav}>
                      <i className="fa-solid fa-user" /> {user?.name || 'Profile'}
                    </Link>
                  ) : (
                    <Link className="nav-link p-0 mobile-login-link" href="/login" onClick={closeMobileNav}>
                      <i className="fa-solid fa-right-to-bracket" /> Login
                    </Link>
                  )}
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
                {isLoggedIn ? (
                  <div className="user-dropdown-wrap" ref={userMenuRef} style={{ position: 'relative', display: 'inline-block', marginLeft: 6 }}>
                    <button onClick={() => setUserMenuOpen(v => !v)} className="user-avatar-btn"
                      title={user?.name || 'Account'}
                      style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0f766e, #14b8a6)',
                        border: 'none', color: '#fff', fontWeight: 700, fontSize: 13,
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', letterSpacing: 0.5,
                        boxShadow: '0 2px 8px rgba(15,118,110,0.3)',
                        transition: 'transform 0.2s',
                      }}>
                      {initials}
                    </button>
                    {userMenuOpen && (
                      <div style={{
                        position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                        background: '#fff', borderRadius: 12,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
                        border: '1px solid #e5e7eb', minWidth: 200,
                        zIndex: 9999, overflow: 'hidden',
                      }}>
                        <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: 0 }}>{user?.name}</p>
                          <p style={{ fontSize: 11.5, color: '#6b7280', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
                        </div>
                        {[
                          { to: '/profile', icon: 'fa-solid fa-user-pen', label: 'My Profile' },
                          { to: '/my-orders', icon: 'fa-solid fa-bag-shopping', label: 'My Orders' },
                          { to: '/wishlist', icon: 'fa-regular fa-heart', label: 'Wishlist' },
                          { to: '/cart', icon: 'fa-solid fa-cart-shopping', label: `Cart${cart.length > 0 ? ` (${cart.length})` : ''}` },
                        ].map(item => (
                          <Link key={item.to} href={item.to}
                            onClick={() => setUserMenuOpen(false)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 10,
                              padding: '11px 16px', color: '#374151',
                              textDecoration: 'none', fontSize: 13.5, fontWeight: 500,
                              transition: 'background 0.15s', borderBottom: '1px solid #f9fafb',
                            }}>
                            <i className={item.icon} style={{ width: 16, color: '#0f766e', fontSize: 14 }} />
                            {item.label}
                          </Link>
                        ))}
                        <button onClick={handleLogout} style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          width: '100%', padding: '11px 16px', background: 'none',
                          border: 'none', color: '#ef4444', fontSize: 13.5,
                          fontWeight: 600, cursor: 'pointer', textAlign: 'left',
                          fontFamily: 'inherit',
                        }}>
                          <i className="fa-solid fa-right-from-bracket" style={{ width: 16, fontSize: 14 }} />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link className="admin mr-0" href="/login" title="Login">
                    <img loading="lazy" src="/assets/images/header-admin.png" alt="Login" />
                  </Link>
                )}
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

