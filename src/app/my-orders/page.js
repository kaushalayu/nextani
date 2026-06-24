'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'
import { usePageMetaFromAdmin } from '../../context/SeoContext'
import API from '../../lib/api'
import SubBanner from '../../components/SubBanner'

export default function MyOrders() {
  const { isLoggedIn } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  usePageMetaFromAdmin('/my-orders', 'My Orders', 'Track and manage all your orders in one place.')

  useEffect(() => {
    if (!isLoggedIn) return
    API.get('/orders/my')
      .then(({ data }) => setOrders(data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [isLoggedIn])

  if (!isLoggedIn) {
    return (
      <>
        <SubBanner title="My Orders" description="Please login to view your orders." page="My Orders" />
        <div className="orders-page">
          <div className="orders-login-prompt">
            <h3>Please Login</h3>
            <p>You need to be logged in to view your orders.</p>
            <Link href="/login" className="btn">Login</Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SubBanner title="My Orders" description="Track and manage all your orders in one place." page="My Orders" />
      <div className="orders-page">
        <div className="container">
          <h1>My Orders ({orders.length})</h1>
          {loading ? (
            <div className="orders-loading">
              <i className="fa-solid fa-spinner fa-spin orders-loading-icon" /><p className="orders-loading-text">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="orders-empty">
              <div className="orders-empty-icon"><i className="fa-solid fa-bag-shopping" /></div>
              <h3>No orders yet</h3>
              <p>Start shopping and your orders will appear here.</p>
              <Link href="/shop" className="btn">Start Shopping</Link>
            </div>
          ) : (
            <table className="orders-table">
              <thead><tr><th>Order</th><th>Date</th><th>Status</th><th>Total</th><th></th></tr></thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td data-label="Order" className="order-id">#{order._id?.slice(-8).toUpperCase()}</td>
                    <td data-label="Date">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td data-label="Status">
  <span style={{
    display: 'inline-block', padding: '4px 12px', borderRadius: 12,
    fontSize: 12, fontWeight: 700, textTransform: 'capitalize',
    color: order.orderStatus === 'confirmed' || order.orderStatus === 'delivered' ? '#059669' : order.orderStatus === 'cancelled' ? '#dc2626' : '#f59e0b',
    background: order.orderStatus === 'confirmed' || order.orderStatus === 'delivered' ? '#d1fae5' : order.orderStatus === 'cancelled' ? '#fee2e2' : '#fef3c7',
  }}>
    {order.orderStatus === 'confirmed' && <><i className="fa-solid fa-circle-check" style={{ marginRight: 4 }} /> Confirmed</>}
    {order.orderStatus === 'pending' && 'Pending'}
    {order.orderStatus === 'processing' && 'Processing'}
    {order.orderStatus === 'shipped' && 'Shipped'}
    {order.orderStatus === 'delivered' && <><i className="fa-solid fa-circle-check" style={{ marginRight: 4 }} /> Delivered</>}
    {order.orderStatus === 'cancelled' && 'Cancelled'}
    {!['pending','confirmed','processing','shipped','delivered','cancelled'].includes(order.orderStatus) && (order.orderStatus || 'pending')}
  </span>
</td>
                    <td data-label="Total" className="order-total">${(order.totalPrice || order.total || 0).toFixed(2)}</td>
                    <td><Link href={`/my-orders/${order._id}`} className="order-view-btn">View <i className="fa-solid fa-arrow-right" /></Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
