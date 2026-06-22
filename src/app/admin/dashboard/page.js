'use client'

import { useState, useEffect } from 'react'
import API from '../../../lib/api'

const statConfig = [
  { label: 'Total Products', key: 'products', icon: 'fa-capsules', color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
  { label: 'Total Orders', key: 'orders', icon: 'fa-truck', color: '#0f766e', bg: 'rgba(15,118,110,0.12)' },
  { label: 'Total Users', key: 'users', icon: 'fa-users', color: '#7c3aed', bg: 'rgba(124,58,237,0.12)' },
  { label: 'Revenue', key: 'revenue', icon: 'fa-dollar-sign', color: '#d97706', bg: 'rgba(217,119,6,0.12)', format: 'currency' },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 })

  useEffect(() => {
    Promise.all([
      API.get('/products?limit=1').then(r => r.data).catch(() => ({ total: 0 })),
      API.get('/orders?limit=1').then(r => r.data).catch(() => ({ total: 0, orders: [] })),
      API.get('/auth/users?limit=1').then(r => r.data).catch(() => ({ total: 0 })),
    ]).then(([products, orders, users]) => {
      setStats({
        products: products.total || 0,
        orders: orders.total || 0,
        users: users.total || 0,
        revenue: (orders.orders || []).reduce((sum, o) => sum + (o.total || 0), 0),
      })
    })
  }, [])

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-hero">
        <h1>Welcome back, Admin</h1>
        <p>Here is what&apos;s happening at Pharmez today.</p>
      </div>

      <div className="admin-stats-grid">
        {statConfig.map(s => (
          <div key={s.key} className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: s.bg, color: s.color }}>
              <i className={`fa-solid ${s.icon}`} />
            </div>
            <div className="admin-stat-info">
              <h3>{s.format === 'currency' ? `$${stats[s.key].toFixed(2)}` : stats[s.key]}</h3>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
