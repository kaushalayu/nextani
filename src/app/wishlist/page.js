'use client'

import Link from 'next/link'
import { useWishlist } from '../../context/WishlistContext'

export default function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist()

  return (
    <div className="wishlist-page">
      <div className="container" style={{ padding: '40px 0' }}>
        <h1>My Wishlist</h1>
        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p>Your wishlist is empty.</p>
            <Link href="/shop" className="btn btn-primary">Browse Products</Link>
          </div>
        ) : (
          <>
            <div className="row">
              {wishlist.map((item, i) => (
                <div className="col-lg-3 col-md-4 col-6" key={i}>
                  <div className="product-card" style={{ marginBottom: 20 }}>
                    <img loading="lazy" src={item.img} alt={item.name} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                    <div style={{ padding: 12 }}>
                      <h5>{item.name}</h5>
                      <p>${item.price?.toFixed(2)}</p>
                      <button onClick={() => removeFromWishlist(item.id)} className="btn btn-sm btn-outline-danger">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={clearWishlist} className="btn btn-outline-secondary">Clear Wishlist</button>
          </>
        )}
      </div>
    </div>
  )
}

