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
    <div>
      <h2 style={{ marginBottom: 24 }}>Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {cards.map(card => (
          <div key={card.label} style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={`fa-solid ${card.icon}`} style={{ color: card.color, fontSize: 20 }} />
              </div>
              <div>
                <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>{card.label}</p>
                <p style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
