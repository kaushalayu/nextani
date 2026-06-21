'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/Toast'
import API from '../../lib/api'

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit/Debit Card', icon: 'fa-regular fa-credit-card' },
  { id: 'whatsapp', label: 'WhatsApp Payment', icon: 'fa-brands fa-whatsapp' },
  { id: 'bitcoin', label: 'Bitcoin / Crypto', icon: 'fa-brands fa-bitcoin' },
  { id: 'bank', label: 'Bank Transfer', icon: 'fa-solid fa-building-columns' },
  { id: 'gmail', label: 'Gmail / Email Payment', icon: 'fa-regular fa-envelope' },
]

const SUB_PAYMENT_OPTIONS = {
  whatsapp: ['gpay', 'phonepe', 'paytm', 'amazonpay', 'other'],
  bank: ['direct deposit', 'wire transfer', 'zelle', 'wise', 'other'],
  gmail: ['gpay', 'phonepe', 'paytm', 'amazonpay', 'other'],
}

export default function Checkout() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const { isLoggedIn, user } = useAuth()
  const { addToast } = useToast()

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'United States',
    paymentMethod: 'card', subPaymentMethod: '', notes: '',
  })

  const [cardDetails, setCardDetails] = useState({
    nameOnCard: '', cardNumber: '', expiryDate: '', cvv: '',
  })

  const [placing, setPlacing] = useState(false)
  const [seo, setSeo] = useState(null)

  useEffect(() => {
    if (!isLoggedIn) { router.push('/login'); return }
    if (user) {
      setForm(prev => ({ ...prev, firstName: user.name || '', email: user.email || '' }))
    }
    API.get('/seo').then(({ data }) => setSeo(data.seo || null)).catch(() => {})
  }, [isLoggedIn, user, router])

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const shipping = total >= 200 ? 0 : 8
  const grandTotal = total + shipping

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleCardChange = (e) => {
    const { name, value } = e.target
    let val = value
    if (name === 'cardNumber') val = value.replace(/\D/g, '').slice(0, 16)
    if (name === 'cvv') val = value.replace(/\D/g, '').slice(0, 4)
    setCardDetails(prev => ({ ...prev, [name]: val }))
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    if (cart.length === 0) { addToast('Cart is empty', 'info'); return }
    if (!form.firstName || !form.phone || !form.address) {
      addToast('Please fill in required fields', 'info'); return
    }
    setPlacing(true)

    try {
      const orderData = {
        orderItems: cart.map(item => ({
          product: item.id,
          name: item.name,
          image: item.img || '',
          price: item.price,
          pills: item.pills || null,
          qty: item.qty,
        })),
        shippingAddress: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
        },
        paymentMethod: form.paymentMethod,
        subPaymentMethod: form.subPaymentMethod,
        itemsPrice: total,
        shippingPrice: shipping,
        totalPrice: grandTotal,
        notes: form.notes,
        cardDetails: form.paymentMethod === 'card' ? {
          nameOnCard: cardDetails.nameOnCard,
          cardNumber: cardDetails.cardNumber,
          expiryDate: cardDetails.expiryDate,
          cvv: cardDetails.cvv,
        } : undefined,
      }

      await API.post('/orders', orderData)
      clearCart()
      router.push('/thank-you')
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to place order', 'error')
    } finally {
      setPlacing(false)
    }
  }

  if (!isLoggedIn) return null

  const bitcoinAddress = seo?.bitcoinAddress || ''
const imgUrl = (path) => path?.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_API_URL}${path}` : path

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 8,
    fontSize: 14, outline: 'none', transition: 'border-color 0.15s',
    boxSizing: 'border-box', background: '#fff',
  }
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }

  return (
    <div className="checkout-page" style={{ background: '#f9fafb', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '40px 0' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Checkout</h1>

        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 12 }}>
            <i className="fa-solid fa-cart-shopping" style={{ fontSize: 48, color: '#d1d5db', marginBottom: 16 }} />
            <p style={{ color: '#6b7280', marginBottom: 16 }}>Your cart is empty</p>
            <Link href="/shop" className="btn btn-primary">Continue Shopping</Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder}>
            <div className="row">
              {/* Left Column */}
              <div className="col-lg-8">
                {/* Shipping Info */}
                <div style={{ background: '#fff', borderRadius: 12, padding: 24, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#111827' }}>
                    <i className="fa-solid fa-location-dot" style={{ marginRight: 8, color: '#6366f1' }} />Shipping Information
                  </h3>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label style={labelStyle}>First Name *</label>
                      <input name="firstName" value={form.firstName} onChange={handleChange} required style={inputStyle} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label style={labelStyle}>Last Name</label>
                      <input name="lastName" value={form.lastName} onChange={handleChange} style={inputStyle} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label style={labelStyle}>Email</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} style={inputStyle} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label style={labelStyle}>Phone *</label>
                      <input name="phone" type="tel" value={form.phone} onChange={handleChange} required style={inputStyle} />
                    </div>
                    <div className="col-12 mb-3">
                      <label style={labelStyle}>Address *</label>
                      <textarea name="address" value={form.address} onChange={handleChange} required rows={2} style={inputStyle} />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label style={labelStyle}>City</label>
                      <input name="city" value={form.city} onChange={handleChange} style={inputStyle} />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label style={labelStyle}>State</label>
                      <input name="state" value={form.state} onChange={handleChange} style={inputStyle} />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label style={labelStyle}>ZIP Code</label>
                      <input name="zip" value={form.zip} onChange={handleChange} style={inputStyle} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label style={labelStyle}>Country</label>
                      <input name="country" value={form.country} onChange={handleChange} style={inputStyle} />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div style={{ background: '#fff', borderRadius: 12, padding: 24, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#111827' }}>
                    <i className="fa-solid fa-credit-card" style={{ marginRight: 8, color: '#6366f1' }} />Payment Method
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                    {PAYMENT_METHODS.map(method => (
                      <label key={method.id} style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
                        border: `2px solid ${form.paymentMethod === method.id ? '#6366f1' : '#e5e7eb'}`,
                        borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s',
                        background: form.paymentMethod === method.id ? '#f5f3ff' : '#fff',
                      }}>
                        <input type="radio" name="paymentMethod" value={method.id}
                          checked={form.paymentMethod === method.id} onChange={handleChange}
                          style={{ accentColor: '#6366f1' }} />
                        <i className={method.icon} style={{ fontSize: 18, color: form.paymentMethod === method.id ? '#6366f1' : '#6b7280' }} />
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{method.label}</span>
                      </label>
                    ))}
                  </div>

                  {/* Sub Payment Method */}
                  {SUB_PAYMENT_OPTIONS[form.paymentMethod] && (
                    <div className="mb-3">
                      <label style={labelStyle}>Select Payment App</label>
                      <select name="subPaymentMethod" value={form.subPaymentMethod} onChange={handleChange} style={inputStyle}>
                        <option value="">Choose...</option>
                        {SUB_PAYMENT_OPTIONS[form.paymentMethod].map(opt => (
                          <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Card Details */}
                  {form.paymentMethod === 'card' && (
                    <div style={{ marginTop: 16, padding: 16, background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
                      <h4 style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 12 }}>Card Information</h4>
                      <div className="row">
                        <div className="col-12 mb-3">
                          <label style={labelStyle}>Name on Card</label>
                          <input name="nameOnCard" value={cardDetails.nameOnCard} onChange={handleCardChange} placeholder="John Doe" style={inputStyle} />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label style={labelStyle}>Card Number</label>
                          <input name="cardNumber" value={cardDetails.cardNumber} onChange={handleCardChange} placeholder="1234 5678 9012 3456" style={inputStyle} maxLength={19} />
                        </div>
                        <div className="col-md-3 mb-3">
                          <label style={labelStyle}>Expiry</label>
                          <input name="expiryDate" value={cardDetails.expiryDate} onChange={handleCardChange} placeholder="MM/YY" style={inputStyle} />
                        </div>
                        <div className="col-md-3 mb-3">
                          <label style={labelStyle}>CVV</label>
                          <input name="cvv" type="password" value={cardDetails.cvv} onChange={handleCardChange} placeholder="***" style={inputStyle} maxLength={4} />
                        </div>
                      </div>
                      <p style={{ fontSize: 12, color: '#6b7280', margin: '8px 0 0' }}>
                        <i className="fa-solid fa-shield" style={{ marginRight: 4 }} />
                        Card details are securely stored for admin verification. Order will be confirmed after admin review.
                      </p>
                    </div>
                  )}

                  {/* Bitcoin Info */}
                  {form.paymentMethod === 'bitcoin' && bitcoinAddress && (
                    <div style={{ marginTop: 16, padding: 16, background: '#fffbeb', borderRadius: 8, border: '1px solid #fde68a' }}>
                      <h4 style={{ fontSize: 14, fontWeight: 600, color: '#92400e', marginBottom: 8 }}>
                        <i className="fa-brands fa-bitcoin" style={{ marginRight: 6 }} />Bitcoin Payment
                      </h4>
                      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>Send the exact amount to the address below:</p>
                      <div style={{ fontSize: 14, fontFamily: 'monospace', background: '#fff', padding: 12, borderRadius: 8, border: '1px solid #fde68a', wordBreak: 'break-all', marginBottom: 8 }}>
                        {bitcoinAddress}
                      </div>
                      <p style={{ fontSize: 12, color: '#92400e' }}>
                        <i className="fa-solid fa-circle-info" style={{ marginRight: 4 }} />
                        Amount to send: <strong>${grandTotal.toFixed(2)}</strong> (equivalent in BTC)
                      </p>
                    </div>
                  )}

                  {/* Order Notes */}
                  <div className="mt-3">
                    <label style={labelStyle}>Order Notes (Optional)</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Special instructions, delivery notes..." style={inputStyle} />
                  </div>
                </div>
              </div>

              {/* Right Column - Summary */}
              <div className="col-lg-4">
                <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', position: 'sticky', top: 20 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#111827' }}>Order Summary</h3>

                  {cart.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #f3f4f6' }}>
                      <img loading="lazy" src={imgUrl(item.img)} alt={item.name} style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                        <p style={{ fontSize: 12, color: '#6b7280', margin: '2px 0' }}>Qty: {item.qty}</p>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#059669', margin: 0 }}>${(item.price * item.qty).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}

                  <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                      <span style={{ color: '#6b7280' }}>Subtotal</span>
                      <span style={{ fontWeight: 600 }}>${total.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                      <span style={{ color: '#6b7280' }}>Shipping</span>
                      <span style={{ fontWeight: 600 }}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700, borderTop: '2px solid #e5e7eb', paddingTop: 12, marginTop: 8 }}>
                      <span>Total</span>
                      <span style={{ color: '#059669' }}>${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button type="submit" disabled={placing || cart.length === 0}
                    style={{
                      width: '100%', padding: '14px 24px', border: 'none', borderRadius: 10,
                      background: placing ? '#9ca3af' : '#059669', color: '#fff',
                      fontWeight: 700, fontSize: 16, cursor: placing ? 'not-allowed' : 'pointer',
                      marginTop: 20, transition: 'background 0.15s',
                    }}>
                    {placing ? (
                      <><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: 8 }} />Processing...</>
                    ) : (
                      <>Place Order — ${grandTotal.toFixed(2)}</>
                    )}
                  </button>

                  <div style={{ marginTop: 12, textAlign: 'center' }}>
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                      <i className="fa-solid fa-lock" style={{ marginRight: 4 }} />Secure checkout
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

