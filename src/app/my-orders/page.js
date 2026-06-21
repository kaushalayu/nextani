'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'
import API from '../../lib/api'

export default function MyOrders() {
  const { isLoggedIn } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) return
    API.get('/orders/my')
      .then(({ data }) => setOrders(data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [isLoggedIn])

  if (!isLoggedIn) {
    return <div className="container" style={{ padding: '60px 0' }}><p>Please login to view orders.</p><Link href="/login">Login</Link></div>
  }

  return (
    <div className="orders-page">
      <div className="container" style={{ padding: '40px 0' }}>
        <h1>My Orders</h1>
        {loading ? <p>Loading...</p> : orders.length === 0 ? (
          <p>No orders yet. <Link href="/shop">Start Shopping</Link></p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead><tr><th>Order</th><th>Date</th><th>Status</th><th>Total</th><th></th></tr></thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>#{order._id?.slice(-6)}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td><span className={`badge bg-${order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'}`}>{order.status}</span></td>
                    <td>${order.total?.toFixed(2)}</td>
                    <td><Link href={`/my-orders/${order._id}`} className="btn btn-sm btn-outline-primary">View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
