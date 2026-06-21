'use client'

import Link from 'next/link'

export default function ThankYou() {
  return (
    <div className="thank-you-page">
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <i className="fa-solid fa-circle-check" style={{ fontSize: 64, color: '#059669', marginBottom: 16 }} />
        <h1>Thank You for Your Order!</h1>
        <p style={{ fontSize: 16, color: '#6b7280', marginBottom: 24 }}>
          Your order has been placed successfully. We will notify you once it ships.
        </p>
        <Link href="/my-orders" className="btn btn-primary">View My Orders</Link>
        <Link href="/shop" className="btn btn-outline-secondary ms-2">Continue Shopping</Link>
      </div>
    </div>
  )
}
