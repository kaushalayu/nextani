'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { usePageMetaFromAdmin } from '../../context/SeoContext'
import { useToast } from '../../components/Toast'
import API from '../../lib/api'

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit/Debit Card', icon: 'fa-regular fa-credit-card' },
  { id: 'whatsapp', label: 'WhatsApp Payment', icon: 'fa-brands fa-whatsapp' },
  { id: 'bitcoin', label: 'Bitcoin / Crypto', icon: 'fa-brands fa-bitcoin' },
  { id: 'bank', label: 'Bank Transfer', icon: 'fa-solid fa-building-columns' },
  { id: 'gmail', label: 'Gmail / Email Payment', icon: 'fa-regular fa-envelope' },
]

const DELIVERY_METHODS = [
  { id: 'overnight', label: 'Overnight Delivery', price: 60, icon: 'fa-solid fa-rocket' },
  { id: 'priority', label: 'Priority Mail Delivery', price: 30.50, icon: 'fa-solid fa-truck-fast' },
  { id: 'first-class', label: 'First Class Delivery', price: 0, icon: 'fa-solid fa-envelope' },
]

export default function Checkout() {
  usePageMetaFromAdmin('/checkout', 'Checkout', 'Complete your order and choose your payment method.')

  const router = useRouter()
  const { cart, clearCart } = useCart()
  const { isLoggedIn, user } = useAuth()
  const { addToast } = useToast()

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'United States',
    paymentMethod: 'whatsapp', notes: '',
  })

  const [cardDetails, setCardDetails] = useState({
    nameOnCard: '', cardNumber: '', expiryDate: '', cvv: '',
  })

  const [placing, setPlacing] = useState(false)
  const [seo, setSeo] = useState(null)
  const [btcPrice, setBtcPrice] = useState(null)
  const [bitcoinTxHash, setBitcoinTxHash] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState('first-class')

  useEffect(() => {
    if (!isLoggedIn) { router.push('/login'); return }
    if (user) {
      setForm(prev => ({ ...prev, firstName: user.name || '', email: user.email || '' }))
    }
    API.get('/seo').then(({ data }) => setSeo(data.seo || null)).catch(() => {})
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
      .then(r => r.json())
      .then(d => setBtcPrice(d.bitcoin?.usd || null))
      .catch(() => {})
  }, [isLoggedIn, user, router])

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const delivery = DELIVERY_METHODS.find(d => d.id === deliveryMethod) || DELIVERY_METHODS[2]
  const shipping = delivery.price
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
    if (form.paymentMethod === 'bitcoin' && !bitcoinTxHash.trim()) {
      addToast('Please enter your Bitcoin transaction hash (TXID) after sending payment', 'info'); return
    }
    if (form.paymentMethod === 'card') {
      if (!cardDetails.nameOnCard.trim() || !cardDetails.cardNumber.trim() || !cardDetails.expiryDate.trim() || !cardDetails.cvv.trim()) {
        addToast('Please fill in all card details (name, number, expiry, CVV)', 'info'); return
      }
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
        bitcoinTxHash: form.paymentMethod === 'bitcoin' ? bitcoinTxHash : '',
        deliveryMethod,
      }

      await API.post('/orders', orderData)
      clearCart()

      if (form.paymentMethod === 'card' || form.paymentMethod === 'bitcoin') {
        addToast('Thank you, we will contact you soon', 'success')
        router.push('/thank-you')
        return
      }

      const customerName = `${form.firstName} ${form.lastName}`

      let orderItems = ''
      cart.forEach((item) => {
        orderItems += `\u2022 ${item.qty} x ${item.name}${item.pills ? ` (${item.pills} pills)` : ''} .................... $${(item.price * item.qty).toFixed(2)}\n`
      })

      let message = '🛒 *New Order - Painomed*\n\n'
      message += '━━━━━━━━━━━━━━━━━━\n'
      message += '*Customer Details*\n'
      message += '━━━━━━━━━━━━━━━━━━\n'
      message += `👤 Name: ${customerName}\n`
      message += `📧 Email: ${form.email}\n`
      message += `📞 Phone: ${form.phone}\n`
      if (form.address) message += `📍 Address: ${form.address}\n`
      if (form.city) message += `🏙️ City: ${form.city}\n`
      if (form.state) message += `📍 State: ${form.state}\n`
      if (form.zip) message += `📮 Zip: ${form.zip}\n`
      message += `🚚 Delivery: ${delivery.label} (${delivery.price === 0 ? 'FREE' : `$${delivery.price.toFixed(2)}`})\n`
      message += '\n━━━━━━━━━━━━━━━━━━\n'
      message += '*Order Details*\n'
      message += '━━━━━━━━━━━━━━━━━━\n'
      message += orderItems
      message += '\n────────────────────\n'
      message += `*Grand Total: $${grandTotal.toFixed(2)}*\n`
      message += '────────────────────\n'
      message += '\n💳 Pay via WhatsApp'
      message += '\n────────────────────\n'
      message += 'Thank you for choosing Painomed! 🙏'

      const waNumber = seo?.whatsappNumber || '61383766284'
      const supportEmail = seo?.supportEmail || 'support@pharmez.com'

      if (form.paymentMethod === 'whatsapp') {
        window.open('https://wa.me/' + waNumber + '?text=' + encodeURIComponent(message), '_blank')
      } else if (form.paymentMethod === 'gmail') {
        const subject = encodeURIComponent(`New Order from ${customerName}`)
        const body = encodeURIComponent(message)
        window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`
      } else if (form.paymentMethod === 'bank') {
        addToast('Bank transfer details will be shared via email', 'success')
      }

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
                    <i className="fa-solid fa-truck" />Delivery Method
                  </h3>
                  <div className="checkout-delivery-grid">
                    {DELIVERY_METHODS.map(method => (
                      <label key={method.id} className={`checkout-delivery-option${deliveryMethod === method.id ? ' active' : ''}`}>
                        <input type="radio" name="deliveryMethod" value={method.id}
                          checked={deliveryMethod === method.id} onChange={e => setDeliveryMethod(e.target.value)} />
                        <i className={method.icon} />
                        <div className="checkout-delivery-info">
                          <span className="checkout-delivery-label">{method.label}</span>
                          <span className="checkout-delivery-price">{method.price === 0 ? 'FREE' : `$${method.price.toFixed(2)}`}</span>
                        </div>
                      </label>
                    ))}
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
                      {btcPrice && (
                        <p className="checkout-bitcoin-info">
                          <i className="fa-solid fa-circle-info checkout-bitcoin-info-icon" />
                          Amount to send: <strong>${grandTotal.toFixed(2)}</strong> ≈ <strong>{(grandTotal / btcPrice).toFixed(6)} BTC</strong>
                        </p>
                      )}
                      <div style={{ marginTop: 14, textAlign: 'center' }}>
                        {seo?.bitcoinQrCode ? (
                          <img loading="lazy" src={imgUrl(seo.bitcoinQrCode)}
                            alt="Bitcoin QR Code" style={{ maxWidth: 180, borderRadius: 12, border: '2px solid #f59e0b' }} />
                        ) : (
                          <img loading="lazy"
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`bitcoin:${bitcoinAddress}${btcPrice ? `?amount=${(grandTotal / btcPrice).toFixed(6)}` : ''}`)}`}
                            alt="Bitcoin QR Code" style={{ borderRadius: 12, border: '2px solid #f59e0b' }} />
                        )}
                      </div>
                      <div style={{ marginTop: 16 }}>
                        <label className="checkout-form-label">Transaction ID (TXID) — paste after sending payment</label>
                        <input
                          type="text" value={bitcoinTxHash} onChange={e => setBitcoinTxHash(e.target.value)}
                          placeholder="Paste your Bitcoin transaction hash here"
                          className="checkout-form-input"
                          style={{ fontSize: 13, fontFamily: 'monospace' }}
                        />
                        <p style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>
                          You can also add this later from your order details page.
                        </p>
                      </div>
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
                    <span>{delivery.label}</span>
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
