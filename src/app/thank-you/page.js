'use client'

import Link from 'next/link'
import SubBanner from '../../components/SubBanner'

export default function ThankYou() {
  return (
    <>
      <SubBanner title="Order Confirmed" description="Your order has been placed successfully." page="Thank You" />
      <div className="thank-you-page">
        <div className="container">
          <div className="thank-you-section">
            <div className="thank-you-icon"><i className="fa-solid fa-circle-check" /></div>
            <h1>Thank You for Your Order!</h1>
            <p className="thank-you-text">Your order has been placed successfully. We will notify you once it ships.</p>
            <Link href="/my-orders" className="btn btn-primary">View My Orders</Link>
            <Link href="/shop" className="btn btn-outline-secondary ms-2">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </>
  )
}
