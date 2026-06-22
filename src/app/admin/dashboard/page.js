'use client'

import { useState, useEffect } from 'react'
import API from '../../../lib/api'

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

  const cards = [
    { label: 'Total Products', value: stats.products, icon: 'fa-capsules', color: '#6366f1' },
    { label: 'Total Orders', value: stats.orders, icon: 'fa-truck', color: '#0f766e' },
    { label: 'Total Users', value: stats.users, icon: 'fa-users', color: '#7c3aed' },
    { label: 'Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: 'fa-dollar-sign', color: '#d97706' },
  ]

  return (
    <div className="admin-dashboard">
      <h2>Dashboard</h2>
      <div className="admin-dashboard-grid">
        {cards.map(card => (
          <div key={card.label} className="admin-dashboard-card">
            <div className="admin-dashboard-card-inner">
              <div className="admin-dashboard-card-icon" style={{ background: `${card.color}15` }}>
                <i className={`fa-solid ${card.icon}`} style={{ color: card.color }} />
              </div>
              <div>
                <p className="admin-dashboard-card-label">{card.label}</p>
                <p className="admin-dashboard-card-value">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
