'use client'

import Link from 'next/link'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'
import { usePageMetaFromAdmin } from '../../context/SeoContext'
import { useToast } from '../../components/Toast'
import SubBanner from '../../components/SubBanner'

export default function Wishlist() {
  usePageMetaFromAdmin('/wishlist', 'Wishlist', 'Your saved items at Painomed.')

  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { addToast } = useToast()

  const handleAddToCart = (item) => {
    addToCart({ id: item.id, name: item.name, price: item.price, img: item.img, qty: 1 })
    addToast(`${item.name} added to cart`, 'cart')
  }

  return (
    <>
      <SubBanner title="My Wishlist" description="Your saved products — add them to cart when you're ready." page="Wishlist" />
      <div className="wishlist-page">
        <div className="container">
          <h1>My Wishlist ({wishlist.length})</h1>
        {wishlist.length === 0 ? (
          <div className="wishlist-empty">
            <div className="wishlist-empty-icon"><i className="fa-regular fa-heart" /></div>
            <h3>Your wishlist is empty</h3>
            <p>Save your favorite products and come back to them anytime.</p>
            <Link href="/shop" className="btn">Browse Products</Link>
          </div>
        ) : (
          <>
            <div className="wishlist-grid">
              {wishlist.map((item, i) => (
                <div className="wishlist-card" key={item.id || i}>
                  <div className="wishlist-card-img">
                    <img loading="lazy" src={item.img} alt={item.name} />
                    <button className="wishlist-card-remove" onClick={() => removeFromWishlist(item.id)} title="Remove">
                      <i className="fa-solid fa-xmark" />
                    </button>
                  </div>
                  <div className="wishlist-card-body">
                    <h5 className="wishlist-card-name">{item.name}</h5>
                    <div className="wishlist-card-price">${item.price?.toFixed(2)}</div>
                    <button className="wishlist-card-btn" onClick={() => handleAddToCart(item)}>
                      <i className="fa-solid fa-cart-plus" /> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="wishlist-actions">
              <button onClick={clearWishlist} className="wishlist-clear-btn">
                <i className="fa-regular fa-trash-can" /> Clear Wishlist
              </button>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  )
}

