'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '../../context/CartContext'
import SubBanner from '../../components/SubBanner'

export default function Cart() {
  const { cart, removeFromCart, updateQty, clearCart } = useCart()
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <>
      <SubBanner title="Shopping Cart" description="Review your selected items and proceed to checkout securely." page="Cart" />
      <div className="cart-page">
        <div className="container">
          <h1>Shopping Cart ({cart.length})</h1>
        {cart.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon"><i className="fa-solid fa-cart-shopping" /></div>
            <h3>Your cart is empty</h3>
            <p>Browse our products and add items to your cart.</p>
            <Link href="/shop" className="btn">Continue Shopping</Link>
          </div>
        ) : (
          <>
            <table className="cart-table">
              <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Total</th><th></th></tr></thead>
              <tbody>
                {cart.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <div className="cart-product-cell">
                        <img loading="lazy" src={item.img} alt={item.name} className="cart-product-img" />
                        <span className="cart-product-name">{item.name}</span>
                      </div>
                    </td>
                    <td data-label="Price">${item.price.toFixed(2)}</td>
                    <td data-label="Qty">
                      <div className="cart-qty-control">
                        <button onClick={() => updateQty(item.id, item.pills, item.qty - 1)}>-</button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.pills, item.qty + 1)}>+</button>
                      </div>
                    </td>
                    <td data-label="Total">${(item.price * item.qty).toFixed(2)}</td>
                    <td><button onClick={() => removeFromCart(item.id, item.pills)} className="cart-remove-btn"><i className="fa-solid fa-trash" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="cart-total-row">
              <div>
                <span className="cart-total-label">Total:</span>
                <span className="cart-total-amount"> ${total.toFixed(2)}</span>
              </div>
              <div className="cart-actions">
                <button onClick={clearCart} className="cart-clear-btn"><i className="fa-regular fa-trash-can" /> Clear Cart</button>
                <Link href="/checkout" className="cart-checkout-btn">Proceed to Checkout <i className="fa-solid fa-arrow-right" /></Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  )
}

