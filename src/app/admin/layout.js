'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import './admin.css'

const navSections = [
  {
    label: 'Main',
    links: [
      { href: '/admin/dashboard', label: 'Dashboard', icon: 'fa-solid fa-gauge' },
      { href: '/admin/products', label: 'Products', icon: 'fa-solid fa-capsules' },
      { href: '/admin/orders', label: 'Orders', icon: 'fa-solid fa-truck' },
    ],
  },
  {
    label: 'Content',
    links: [
      { href: '/admin/categories', label: 'Categories', icon: 'fa-solid fa-tags' },
      { href: '/admin/blogs', label: 'Blogs', icon: 'fa-solid fa-blog' },
      { href: '/admin/testimonials', label: 'Testimonials', icon: 'fa-solid fa-star' },
      { href: '/admin/faqs', label: 'FAQs', icon: 'fa-solid fa-question' },
      { href: '/admin/team', label: 'Team', icon: 'fa-solid fa-user-tie' },
      { href: '/admin/services', label: 'Services', icon: 'fa-solid fa-hand-holding-heart' },
    ],
  },
  {
    label: 'Settings',
    links: [
      { href: '/admin/users', label: 'Users', icon: 'fa-solid fa-users' },
      { href: '/admin/seo', label: 'SEO', icon: 'fa-solid fa-magnifying-glass' },
      { href: '/admin/page-meta', label: 'Page Meta', icon: 'fa-solid fa-file-pen' },
      { href: '/admin/messages', label: 'Messages', icon: 'fa-solid fa-envelope' },
      { href: '/admin/newsletter', label: 'Newsletter', icon: 'fa-solid fa-newspaper' },
    ],
  },
]

export default function AdminLayout({ children }) {
  const { isLoggedIn, isAdmin, user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(false)
      setSidebarOpen(false)
    }
  }, [isMobile])

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [pathname, isMobile])

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setSidebarOpen(prev => !prev)
    } else {
      setSidebarCollapsed(prev => !prev)
    }
  }, [isMobile])

  const closeSidebar = useCallback(() => {
    if (isMobile) setSidebarOpen(false)
  }, [isMobile])

  if (!isLoggedIn || !isAdmin) {
    router.push('/login')
    return null
  }

  return (
    <div className={`admin-wrapper${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
      <div className={`admin-mobile-overlay${sidebarOpen ? ' show' : ''}`} onClick={closeSidebar} />

      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo-icon">P</div>
          <span className="admin-logo-text">Pharmez <span>Admin</span></span>
          <span className="admin-sidebar-badge">v2.0</span>
        </div>

        <nav className="admin-nav">
          {navSections.map(section => (
            <div key={section.label}>
              <div className="admin-nav-section-label">{section.label}</div>
              {section.links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`admin-nav-item${pathname === link.href ? ' active' : ''}`}
                  onClick={closeSidebar}
                >
                  <span className="admin-nav-icon">
                    <i className={link.icon} />
                  </span>
                  <span className="admin-nav-label">{link.label}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button onClick={() => { logout(); router.push('/login'); }} className="admin-logout-btn">
            <span className="admin-nav-icon">
              <i className="fa-solid fa-right-from-bracket" />
            </span>
            Sign Out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-left">
            <button className="admin-mobile-toggle" onClick={toggleSidebar}>
              <i className="fa-solid fa-bars" />
            </button>
            <button className="admin-toggle-btn" onClick={toggleSidebar}>
              <i className={`fa-solid ${sidebarCollapsed ? 'fa-bars-staggered' : 'fa-bars'}`} />
            </button>
            <div className="admin-topbar-search">
              <i className="fa-solid fa-search" />
              <input type="text" placeholder="Search..." />
            </div>
          </div>
          <div className="admin-topbar-right">
            <Link href="/" className="admin-visit-site">
              <i className="fa-solid fa-arrow-up-right-from-square" />
              <span>Visit Site</span>
            </Link>
            <div className="admin-user-info">
              <div className="admin-user-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <span className="admin-user-name">{user?.name || 'Admin'}</span>
              <span className="admin-role-badge">Admin</span>
            </div>
          </div>
        </div>

        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  )
}
