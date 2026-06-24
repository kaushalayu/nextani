'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../context/AuthContext'
import { usePageMetaFromAdmin } from '../../../context/SeoContext'
import API from '../../../lib/api'
import SubBanner from '../../../components/SubBanner'

const STATUS_BADGE = {
  pending: { label: 'Pending', color: '#f59e0b', bg: '#fef3c7' },
  confirmed: { label: 'Confirmed', color: '#059669', bg: '#d1fae5' },
  processing: { label: 'Processing', color: '#3b82f6', bg: '#dbeafe' },
  shipped: { label: 'Shipped', color: '#8b5cf6', bg: '#ede9fe' },
  delivered: { label: 'Delivered', color: '#059669', bg: '#d1fae5' },
  cancelled: { label: 'Cancelled', color: '#dc2626', bg: '#fee2e2' },
}

export default function OrderDetail() {
  const { id } = useParams()
  const { isLoggedIn } = useAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  usePageMetaFromAdmin('/my-orders', 'Order Details', 'View your order details and status')

  useEffect(() => {
    if (!isLoggedIn || !id) return
    API.get(`/orders/${id}`)
      .then(({ data }) => {
        if (data.success) setOrder(data.order)
        else setError('Order not found')
      })
      .catch(() => setError('Failed to load order'))
      .finally(() => setLoading(false))
  }, [isLoggedIn, id])

  if (!isLoggedIn) {
    return (
      <>
        <SubBanner title="Order Details" description="Please login to view your order." page="Order Details" />
        <div className="orders-page">
          <div className="orders-login-prompt">
            <h3>Please Login</h3>
            <p>You need to be logged in to view your order.</p>
            <Link href="/login" className="btn">Login</Link>
          </div>
        </div>
      </>
    )
  }

  if (loading) {
    return (
      <>
        <SubBanner title="Order Details" description="Loading order information..." page="Order Details" />
        <div className="orders-page">
          <div className="orders-loading">
            <i className="fa-solid fa-spinner fa-spin orders-loading-icon" />
            <p className="orders-loading-text">Loading order...</p>
          </div>
        </div>
      </>
    )
  }

  if (error || !order) {
    return (
      <>
        <SubBanner title="Order Not Found" description="We could not find this order." page="Order Details" />
        <div className="orders-page">
          <div className="orders-empty">
            <div className="orders-empty-icon"><i className="fa-solid fa-circle-exclamation" /></div>
            <h3>{error || 'Order not found'}</h3>
            <p>Please check the order ID and try again.</p>
            <Link href="/my-orders" className="btn">Back to My Orders</Link>
          </div>
        </div>
      </>
    )
  }

  const statusInfo = STATUS_BADGE[order.orderStatus] || STATUS_BADGE.pending
  const createdAt = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  return (
    <>
      <SubBanner title="Order Details" description={`Order #${order._id?.slice(-8).toUpperCase()}`} page="Order Details" />
      <div className="orders-page">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 22 }}>Order #{order._id?.slice(-8).toUpperCase()}</h1>
              <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: 14 }}>Placed on {createdAt}</p>
            </div>
            <div>
              <span style={{
                display: 'inline-block', padding: '6px 16px', borderRadius: 20,
                fontSize: 13, fontWeight: 700, color: statusInfo.color, background: statusInfo.bg,
              }}>
                {statusInfo.label}
              </span>
            </div>
          </div>

          {order.orderStatus === 'confirmed' && (
            <div style={{
              background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: 12,
              padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <i className="fa-solid fa-circle-check" style={{ fontSize: 24, color: '#059669' }} />
              <div>
                <strong style={{ color: '#065f46', fontSize: 15 }}>Order Confirmed!</strong>
                <p style={{ color: '#047857', margin: '2px 0 0', fontSize: 13 }}>Your order has been confirmed by the admin. We will process it soon.</p>
              </div>
            </div>
          )}

          {order.orderStatus === 'delivered' && (
            <div style={{
              background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: 12,
              padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <i className="fa-solid fa-circle-check" style={{ fontSize: 24, color: '#059669' }} />
              <div>
                <strong style={{ color: '#065f46', fontSize: 15 }}>Delivered!</strong>
                <p style={{ color: '#047857', margin: '2px 0 0', fontSize: 13 }}>Your order has been delivered successfully.</p>
              </div>
            </div>
          )}

          {order.orderStatus === 'cancelled' && (
            <div style={{
              background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 12,
              padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <i className="fa-solid fa-circle-xmark" style={{ fontSize: 24, color: '#dc2626' }} />
              <div>
                <strong style={{ color: '#991b1b', fontSize: 15 }}>Order Cancelled</strong>
                <p style={{ color: '#b91c1c', margin: '2px 0 0', fontSize: 13 }}>This order has been cancelled.</p>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            <div style={{
              background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20,
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: '#111827' }}>
                <i className="fa-solid fa-truck" style={{ marginRight: 8, color: '#0f766e' }} /> Shipping Address
              </h3>
              <div style={{ fontSize: 13.5, color: '#374151', lineHeight: 1.8 }}>
                <p style={{ margin: 0, fontWeight: 600 }}>
                  {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                </p>
                <p style={{ margin: 0 }}>{order.shippingAddress?.address}</p>
                <p style={{ margin: 0 }}>
                  {order.shippingAddress?.city}{order.shippingAddress?.state ? `, ${order.shippingAddress.state}` : ''} {order.shippingAddress?.zip}
                </p>
                <p style={{ margin: 0 }}>{order.shippingAddress?.country}</p>
                <p style={{ margin: '8px 0 0' }}>
                  <i className="fa-solid fa-envelope" style={{ marginRight: 6, color: '#9ca3af' }} />
                  {order.shippingAddress?.email}
                </p>
                <p style={{ margin: 0 }}>
                  <i className="fa-solid fa-phone" style={{ marginRight: 6, color: '#9ca3af' }} />
                  {order.shippingAddress?.phone}
                </p>
              </div>
            </div>

            <div style={{
              background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20,
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: '#111827' }}>
                <i className="fa-solid fa-credit-card" style={{ marginRight: 8, color: '#0f766e' }} /> Payment
              </h3>
              <div style={{ fontSize: 13.5, color: '#374151' }}>
                <p style={{ margin: '0 0 6px' }}>
                  <strong>Method:</strong> {order.paymentMethod?.charAt(0).toUpperCase() + order.paymentMethod?.slice(1)}
                </p>
                <p style={{ margin: '0 0 6px' }}>
                  <strong>Status:</strong>{' '}
                  <span style={{ color: order.isPaid ? '#059669' : '#f59e0b' }}>
                    {order.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Total:</strong> ${order.totalPrice?.toFixed(2)}
                </p>
                {order.notes && (
                  <p style={{ margin: '8px 0 0', color: '#6b7280', fontStyle: 'italic' }}>
                    Note: {order.notes}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div style={{
            background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', marginBottom: 24,
          }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#111827' }}>
                <i className="fa-solid fa-bag-shopping" style={{ marginRight: 8, color: '#0f766e' }} /> Order Items ({order.orderItems?.length || 0})
              </h3>
            </div>
            <div style={{ padding: 0 }}>
              {order.orderItems?.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '14px 20px', borderBottom: idx < order.orderItems.length - 1 ? '1px solid #f3f4f6' : 'none',
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 10, overflow: 'hidden',
                    background: '#f3f4f6', flexShrink: 0,
                  }}>
                    {item.product?.image ? (
                      <img
                        src={item.product.image.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL}${item.product.image}` : item.product.image}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af' }}>
                        <i className="fa-solid fa-pills" />
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: '#111827' }}>{item.name}</p>
                    {item.pills && <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6b7280' }}>{item.pills} pills</p>}
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6b7280' }}>Qty: {item.qty}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#111827' }}>${(item.price * item.qty).toFixed(2)}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9ca3af' }}>${item.price?.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              padding: '16px 20px', borderTop: '1px solid #e5e7eb', background: '#f9fafb',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 6 }}>
                <span style={{ color: '#6b7280' }}>Subtotal</span>
                <span style={{ color: '#374151' }}>${order.itemsPrice?.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 6 }}>
                <span style={{ color: '#6b7280' }}>Shipping</span>
                <span style={{ color: '#374151' }}>{order.shippingPrice === 0 ? 'Free' : `$${order.shippingPrice?.toFixed(2)}`}</span>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 700,
                borderTop: '1px solid #e5e7eb', paddingTop: 12, marginTop: 6,
              }}>
                <span style={{ color: '#111827' }}>Total</span>
                <span style={{ color: '#0f766e' }}>${order.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
            <Link href="/my-orders" className="btn" style={{
              padding: '10px 24px', borderRadius: 8, background: '#f3f4f6', color: '#374151',
              textDecoration: 'none', fontSize: 14, fontWeight: 600,
            }}>
              <i className="fa-solid fa-arrow-left" style={{ marginRight: 6 }} /> Back to Orders
            </Link>
            <Link href="/shop" className="btn" style={{
              padding: '10px 24px', borderRadius: 8, background: '#0f766e', color: '#fff',
              textDecoration: 'none', fontSize: 14, fontWeight: 600,
            }}>
              Continue Shopping <i className="fa-solid fa-arrow-right" style={{ marginLeft: 6 }} />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
