'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: 'fa-solid fa-gauge' },
  { href: '/admin/products', label: 'Products', icon: 'fa-solid fa-capsules' },
  { href: '/admin/orders', label: 'Orders', icon: 'fa-solid fa-truck' },
  { href: '/admin/users', label: 'Users', icon: 'fa-solid fa-users' },
  { href: '/admin/categories', label: 'Categories', icon: 'fa-solid fa-tags' },
  { href: '/admin/blogs', label: 'Blogs', icon: 'fa-solid fa-blog' },
  { href: '/admin/seo', label: 'SEO', icon: 'fa-solid fa-magnifying-glass' },
  { href: '/admin/page-meta', label: 'Page Meta', icon: 'fa-solid fa-file-pen' },
  { href: '/admin/testimonials', label: 'Testimonials', icon: 'fa-solid fa-star' },
  { href: '/admin/faqs', label: 'FAQs', icon: 'fa-solid fa-question' },
  { href: '/admin/team', label: 'Team', icon: 'fa-solid fa-user-tie' },
  { href: '/admin/services', label: 'Services', icon: 'fa-solid fa-hand-holding-heart' },
  { href: '/admin/messages', label: 'Messages', icon: 'fa-solid fa-envelope' },
]

export default function AdminLayout({ children }) {
  const { isLoggedIn, isAdmin, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  if (!isLoggedIn || !isAdmin) {
    router.push('/login')
    return null
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link href="/admin/dashboard" className="admin-sidebar-brand">Pharmez Admin</Link>
        </div>
        <nav className="admin-sidebar-nav">
          {adminLinks.map(link => (
            <Link key={link.href} href={link.href}
              className={`admin-sidebar-link${pathname === link.href ? ' active' : ''}`}>
              <i className={link.icon} />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <button onClick={() => { logout(); router.push('/login'); }} className="admin-sidebar-logout">
            <i className="fa-solid fa-right-from-bracket" /> Sign Out
          </button>
        </div>
      </aside>
      <main className="admin-main">
        {children}
      </main>
    </div>
  )
}
