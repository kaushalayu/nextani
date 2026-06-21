'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'
import API from '../../lib/api'

export default function Profile() {
  const { isLoggedIn, user, logout } = useAuth()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    if (isLoggedIn) {
      API.get('/orders/my?limit=5')
        .then(({ data }) => setOrders(data.orders || []))
        .catch(() => {})
    }
  }, [isLoggedIn])

  if (!isLoggedIn) {
    return <div className="container" style={{ padding: '60px 0' }}><p>Please login.</p><Link href="/login">Login</Link></div>
  }

  return (
    <div className="profile-page">
      <div className="container" style={{ padding: '40px 0' }}>
        <h1>My Profile</h1>
        <div className="card" style={{ maxWidth: 500, marginBottom: 24 }}>
          <div className="card-body">
            <h5 className="card-title">{user?.name}</h5>
            <p className="card-text">{user?.email}</p>
            <button onClick={logout} className="btn btn-outline-danger">Logout</button>
          </div>
        </div>
        <h2>Recent Orders</h2>
        {orders.length > 0 ? (
          <ul>{orders.map(order => <li key={order._id}>#{order._id?.slice(-6)} — ${order.total?.toFixed(2)}</li>)}</ul>
        ) : <p>No recent orders.</p>}
        <Link href="/my-orders">View All Orders</Link>
      </div>
    </div>
  )
}
