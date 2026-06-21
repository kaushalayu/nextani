'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '../../context/CartContext'

export default function Cart() {
  const { cart, removeFromCart, updateQty, clearCart } = useCart()
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <div className="cart-page">
      <div className="container" style={{ padding: '40px 0' }}>
        <h1>Shopping Cart</h1>
        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p>Your cart is empty.</p>
            <Link href="/shop" className="btn btn-primary">Continue Shopping</Link>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table">
                <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Total</th><th></th></tr></thead>
                <tbody>
                  {cart.map((item, i) => (
                    <tr key={i}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <img src={item.img} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                          <span>{item.name}</span>
                        </div>
                      </td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>
                        <div className="sp-qty-control" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button onClick={() => updateQty(item.id, item.pills, item.qty - 1)}>-</button>
                          <span>{item.qty}</span>
                          <button onClick={() => updateQty(item.id, item.pills, item.qty + 1)}>+</button>
                        </div>
                      </td>
                      <td>${(item.price * item.qty).toFixed(2)}</td>
                      <td><button onClick={() => removeFromCart(item.id, item.pills)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><i className="fa-solid fa-trash"></i></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
              <div><strong>Total: ${total.toFixed(2)}</strong></div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={clearCart} className="btn btn-outline-secondary">Clear Cart</button>
                <Link href="/checkout" className="btn btn-primary">Proceed to Checkout</Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
