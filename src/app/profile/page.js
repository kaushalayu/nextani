'use client'

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePageMetaFromAdmin } from '../../context/SeoContext'
import API from '../../lib/api'
import SubBanner from '../../components/SubBanner'

export default function Profile() {
  usePageMetaFromAdmin('/my-orders', 'My Orders', 'Track your orders by providing your email address.')

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [searched, setSearched] = useState(false)

  const handleLookup = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const { data } = await API.get(`/orders/my?email=${encodeURIComponent(email.trim())}`)
      setOrders(data.orders || [])
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SubBanner title="My Orders" description="Track your orders by providing your email address." page="My Orders" />
      <div className="orders-page">
        <div className="container">
          <h1>My Orders</h1>
          <div style={{ maxWidth: 480, marginBottom: 32 }}>
            <p style={{ color: '#6b7280', marginBottom: 12 }}>Enter your email to look up your orders:</p>
            <form onSubmit={handleLookup} style={{ display: 'flex', gap: 8 }}>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Your email address" required
                style={{
                  flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db',
                  fontSize: 14, outline: 'none',
                }}
              />
              <button type="submit" style={{
                padding: '10px 20px', borderRadius: 8, border: 'none',
                background: '#0f766e', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer',
              }}>
                <i className="fa-solid fa-search" /> Look Up
              </button>
            </form>
          </div>

          {loading && searched ? (
            <div className="orders-loading">
              <i className="fa-solid fa-spinner fa-spin orders-loading-icon" /><p className="orders-loading-text">Loading orders...</p>
            </div>
          ) : searched && orders.length === 0 ? (
            <div className="orders-empty">
              <div className="orders-empty-icon"><i className="fa-solid fa-bag-shopping" /></div>
              <h3>No orders found</h3>
              <p>No orders found for this email. Check the email you used when ordering.</p>
              <Link href="/shop" className="btn">Start Shopping</Link>
            </div>
          ) : orders.length > 0 ? (
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
          ) : null}
        </div>
      </div>
    </>
  )
}
