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

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>

        {cart.length === 0 ? (
          <div className="checkout-empty">
            <div className="checkout-empty-icon"><i className="fa-solid fa-cart-shopping" /></div>
            <h3>Your cart is empty</h3>
            <p>Add items to your cart before checking out.</p>
            <Link href="/shop" className="btn">Continue Shopping</Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder}>
            <div className="row">
              <div className="col-lg-8">
                <div className="checkout-section">
                  <h3 className="checkout-section-title">
                    <i className="fa-solid fa-location-dot" />Shipping Information
                  </h3>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="checkout-form-label">First Name *</label>
                      <input name="firstName" value={form.firstName} onChange={handleChange} required className="checkout-form-input" />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="checkout-form-label">Last Name</label>
                      <input name="lastName" value={form.lastName} onChange={handleChange} className="checkout-form-input" />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="checkout-form-label">Email</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} className="checkout-form-input" />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="checkout-form-label">Phone *</label>
                      <input name="phone" type="tel" value={form.phone} onChange={handleChange} required className="checkout-form-input" />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="checkout-form-label">Address *</label>
                      <textarea name="address" value={form.address} onChange={handleChange} required rows={2} className="checkout-form-textarea" />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="checkout-form-label">City</label>
                      <input name="city" value={form.city} onChange={handleChange} className="checkout-form-input" />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="checkout-form-label">State</label>
                      <input name="state" value={form.state} onChange={handleChange} className="checkout-form-input" />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="checkout-form-label">ZIP Code</label>
                      <input name="zip" value={form.zip} onChange={handleChange} className="checkout-form-input" />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="checkout-form-label">Country</label>
                      <input name="country" value={form.country} onChange={handleChange} className="checkout-form-input" />
                    </div>
                  </div>
                </div>

                <div className="checkout-section">
                  <h3 className="checkout-section-title">
                    <i className="fa-solid fa-credit-card" />Payment Method
                  </h3>
                  <div className="checkout-payment-grid">
                    {PAYMENT_METHODS.map(method => (
                      <label key={method.id} className={`checkout-payment-option${form.paymentMethod === method.id ? ' active' : ''}`}>
                        <input type="radio" name="paymentMethod" value={method.id}
                          checked={form.paymentMethod === method.id} onChange={handleChange} />
                        <i className={method.icon} />
                        <span>{method.label}</span>
                      </label>
                    ))}
                  </div>

                  {SUB_PAYMENT_OPTIONS[form.paymentMethod] && (
                    <div className="mb-3">
                      <label className="checkout-form-label">Select Payment App</label>
                      <select name="subPaymentMethod" value={form.subPaymentMethod} onChange={handleChange} className="checkout-form-input">
                        <option value="">Choose...</option>
                        {SUB_PAYMENT_OPTIONS[form.paymentMethod].map(opt => (
                          <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {form.paymentMethod === 'card' && (
                    <div className="checkout-card-section">
                      <h4>Card Information</h4>
                      <div className="row">
                        <div className="col-12 mb-3">
                          <label className="checkout-form-label">Name on Card</label>
                          <input name="nameOnCard" value={cardDetails.nameOnCard} onChange={handleCardChange} placeholder="John Doe" className="checkout-form-input" />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="checkout-form-label">Card Number</label>
                          <input name="cardNumber" value={cardDetails.cardNumber} onChange={handleCardChange} placeholder="1234 5678 9012 3456" className="checkout-form-input" maxLength={19} />
                        </div>
                        <div className="col-md-3 mb-3">
                          <label className="checkout-form-label">Expiry</label>
                          <input name="expiryDate" value={cardDetails.expiryDate} onChange={handleCardChange} placeholder="MM/YY" className="checkout-form-input" />
                        </div>
                        <div className="col-md-3 mb-3">
                          <label className="checkout-form-label">CVV</label>
                          <input name="cvv" type="password" value={cardDetails.cvv} onChange={handleCardChange} placeholder="***" className="checkout-form-input" maxLength={4} />
                        </div>
                      </div>
                      <p className="checkout-card-note">
                        <i className="fa-solid fa-shield" />
                        Card details are securely stored for admin verification. Order will be confirmed after admin review.
                      </p>
                    </div>
                  )}

                  {form.paymentMethod === 'bitcoin' && bitcoinAddress && (
                    <div className="checkout-bitcoin-box">
                      <h4><i className="fa-brands fa-bitcoin" />Bitcoin Payment</h4>
                      <p className="checkout-bitcoin-label">Send the exact amount to the address below:</p>
                      <div className="checkout-bitcoin-address">{bitcoinAddress}</div>
                      <p className="checkout-bitcoin-info">
                        <i className="fa-solid fa-circle-info checkout-bitcoin-info-icon" />
                        Amount to send: <strong>${grandTotal.toFixed(2)}</strong> (equivalent in BTC)
                      </p>
                    </div>
                  )}

                  <div className="mt-3">
                    <label className="checkout-form-label">Order Notes (Optional)</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Special instructions, delivery notes..." className="checkout-notes" />
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="checkout-summary-card">
                  <h3 className="checkout-summary-title">Order Summary</h3>

                  {cart.map((item, i) => (
                    <div key={i} className="checkout-summary-item">
                      <img loading="lazy" src={imgUrl(item.img)} alt={item.name} className="checkout-summary-item-img" />
                      <div className="checkout-summary-item-info">
                        <p className="checkout-summary-item-name">{item.name}</p>
                        <p className="checkout-summary-item-qty">Qty: {item.qty}</p>
                      </div>
                      <span className="checkout-summary-item-price">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}

                  <div className="checkout-summary-row">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className={`checkout-summary-row${shipping === 0 ? ' free' : ''}`}>
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="checkout-summary-row total">
                    <span>Total</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>

                  <button type="submit" disabled={placing || cart.length === 0} className="checkout-place-btn">
                    {placing ? (
                      <><i className="fa-solid fa-spinner fa-spin" />Processing...</>
                    ) : (
                      <>Place Order — ${grandTotal.toFixed(2)}</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

