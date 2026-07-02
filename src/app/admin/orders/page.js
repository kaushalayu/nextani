'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import API from '../../../lib/api'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [deleting, setDeleting] = useState(null)

  const handleDelete = async (id) => {
    if (!confirm('Delete this order permanently?')) return
    setDeleting(id)
    try {
      await API.delete(`/orders/${id}`)
      setOrders(prev => prev.filter(o => o._id !== id))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete')
    } finally {
      setDeleting(null)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = () => {
    setLoading(true)
    API.get('/orders?limit=100')
      .then(({ data }) => setOrders(data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }

  const filtered = filter ? orders.filter(o => o.orderStatus === filter) : orders

  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.orderStatus === 'pending').length,
    confirmed: orders.filter(o => o.orderStatus === 'confirmed').length,
    processing: orders.filter(o => o.orderStatus === 'processing').length,
    shipped: orders.filter(o => o.orderStatus === 'shipped').length,
    delivered: orders.filter(o => o.orderStatus === 'delivered').length,
    cancelled: orders.filter(o => o.orderStatus === 'cancelled').length,
  }

  const totalRevenue = orders
    .filter(o => o.orderStatus !== 'cancelled')
    .reduce((sum, o) => sum + (o.totalPrice || o.total || 0), 0)

  const sectionStyle = { background: '#fff', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>Orders</h2>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
        <div style={{ ...sectionStyle, padding: 16, cursor: 'pointer', border: !filter ? '2px solid #6366f1' : '2px solid transparent' }} onClick={() => setFilter('')}>
          <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>All Orders</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>{counts.all}</p>
        </div>
        <div style={{ ...sectionStyle, padding: 16, cursor: 'pointer', border: filter === 'pending' ? '2px solid #f59e0b' : '2px solid transparent' }} onClick={() => setFilter('pending')}>
          <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>Pending</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b', margin: 0 }}>{counts.pending}</p>
        </div>
        <div style={{ ...sectionStyle, padding: 16, cursor: 'pointer', border: filter === 'confirmed' ? '2px solid #3b82f6' : '2px solid transparent' }} onClick={() => setFilter('confirmed')}>
          <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>Confirmed</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: '#3b82f6', margin: 0 }}>{counts.confirmed}</p>
        </div>
        <div style={{ ...sectionStyle, padding: 16, cursor: 'pointer', border: filter === 'processing' ? '2px solid #8b5cf6' : '2px solid transparent' }} onClick={() => setFilter('processing')}>
          <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>Processing</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: '#8b5cf6', margin: 0 }}>{counts.processing}</p>
        </div>
        <div style={{ ...sectionStyle, padding: 16, cursor: 'pointer', border: filter === 'shipped' ? '2px solid #0f766e' : '2px solid transparent' }} onClick={() => setFilter('shipped')}>
          <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>Shipped</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: '#0f766e', margin: 0 }}>{counts.shipped}</p>
        </div>
        <div style={{ ...sectionStyle, padding: 16, cursor: 'pointer', border: filter === 'delivered' ? '2px solid #059669' : '2px solid transparent' }} onClick={() => setFilter('delivered')}>
          <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>Delivered</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: '#059669', margin: 0 }}>{counts.delivered}</p>
        </div>
        <div style={{ ...sectionStyle, padding: 16, border: '2px solid transparent' }}>
          <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>Revenue</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: '#059669', margin: 0 }}>${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? <p>Loading...</p> : (
        <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <table className="table mb-0" style={{ fontSize: 14 }}>
            <thead>
              <tr>
                <th>Order</th><th>Customer</th><th>Date</th><th>Items</th><th>Payment</th><th>Total</th><th>Status</th><th>Paid</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: 24, color: '#9ca3af' }}>No orders found</td></tr>
              ) : (
                filtered.map(o => (
                  <tr key={o._id}>
                    <td style={{ fontWeight: 600 }}>#{o._id?.slice(-6).toUpperCase()}</td>
                    <td>{o.shippingAddress?.firstName || o.user?.name || o.shipping?.name || 'N/A'}</td>
                    <td style={{ fontSize: 13, color: '#6b7280' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td>{(o.orderItems || []).length}</td>
                    <td>
                      <span style={{
                        display: 'inline-block', padding: '2px 8px', borderRadius: 10,
                        background: (o.paymentMethod || 'whatsapp') === 'whatsapp' ? '#dbeafe' : (o.paymentMethod || 'whatsapp') === 'card' ? '#f3f4f6' : (o.paymentMethod || 'whatsapp') === 'bitcoin' ? '#fef3c7' : (o.paymentMethod || 'whatsapp') === 'bank' ? '#e0e7ff' : (o.paymentMethod || 'whatsapp') === 'gmail' ? '#fce7f3' : '#dbeafe',
                        color: (o.paymentMethod || 'whatsapp') === 'whatsapp' ? '#1d4ed8' : (o.paymentMethod || 'whatsapp') === 'card' ? '#374151' : (o.paymentMethod || 'whatsapp') === 'bitcoin' ? '#92400e' : (o.paymentMethod || 'whatsapp') === 'bank' ? '#3730a3' : (o.paymentMethod || 'whatsapp') === 'gmail' ? '#9d174d' : '#1d4ed8',
                        fontSize: 11, fontWeight: 600, textTransform: 'capitalize',
                      }}>
                        {o.paymentMethod || 'whatsapp'}
                        {o.subPaymentMethod && ` / ${o.subPaymentMethod}`}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>${(o.totalPrice || o.total || 0).toFixed(2)}</td>
                    <td>
                      <span style={{
                        padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600, textTransform: 'capitalize',
                        background: o.orderStatus === 'delivered' ? '#d1fae5' : o.orderStatus === 'cancelled' ? '#fce4ec' : o.orderStatus === 'pending' ? '#fef3c7' : o.orderStatus === 'confirmed' ? '#dbeafe' : o.orderStatus === 'processing' ? '#e0e7ff' : o.orderStatus === 'shipped' ? '#ccfbf1' : '#f3f4f6',
                        color: o.orderStatus === 'delivered' ? '#059669' : o.orderStatus === 'cancelled' ? '#ef4444' : o.orderStatus === 'pending' ? '#d97706' : o.orderStatus === 'confirmed' ? '#1d4ed8' : o.orderStatus === 'processing' ? '#3730a3' : o.orderStatus === 'shipped' ? '#0f766e' : '#374151',
                      }}>
                        {o.orderStatus || 'pending'}
                      </span>
                    </td>
                    <td>
                      <i className={`fa-solid ${o.isPaid ? 'fa-circle-check' : 'fa-circle'}`}
                        style={{ color: o.isPaid ? '#059669' : '#d1d5db', fontSize: 14 }} />
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <Link href={`/admin/orders/${o._id}`} className="btn btn-sm btn-outline-primary" style={{ marginRight: 4 }}>View</Link>
                      <button onClick={() => handleDelete(o._id)} disabled={deleting === o._id}
                        className="btn btn-sm btn-outline-danger">
                        {deleting === o._id ? <i className="fa-solid fa-spinner fa-spin" /> : <i className="fa-solid fa-trash" />}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
