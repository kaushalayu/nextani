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
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 240, background: '#1e293b', color: '#fff', padding: '20px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #334155', marginBottom: 16 }}>
          <Link href="/admin/dashboard" style={{ color: '#fff', textDecoration: 'none', fontSize: 20, fontWeight: 700 }}>Pharmez Admin</Link>
        </div>
        <nav>
          {adminLinks.map(link => (
            <Link key={link.href} href={link.href}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px',
                color: pathname === link.href ? '#fff' : '#94a3b8',
                background: pathname === link.href ? '#334155' : 'transparent',
                textDecoration: 'none', fontSize: 14, fontWeight: 500,
                borderLeft: pathname === link.href ? '3px solid #6366f1' : '3px solid transparent',
              }}>
              <i className={link.icon} style={{ width: 16 }} />
              {link.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '20px', borderTop: '1px solid #334155', marginTop: 'auto' }}>
          <button onClick={() => { logout(); router.push('/login'); }}
            style={{ background: 'none', border: '1px solid #475569', color: '#94a3b8', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', width: '100%' }}>
            <i className="fa-solid fa-right-from-bracket" /> Sign Out
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: 24, background: '#f1f5f9', overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
