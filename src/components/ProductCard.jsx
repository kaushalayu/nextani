'use client'

import Link from 'next/link'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from './Toast'

function ProductCard({ product, layout = 'grid' }) {
  const { addToCart } = useCart()
  const { addToWishlist, wishlist } = useWishlist()
  const { addToast } = useToast()

  const isInWishlist = wishlist.find((w) => w.id === product._id)

  const displayPrice =
    product.hasPillsOptions && product.pillsOptions?.length > 0
      ? product.pillsOptions[0].price
      : product.price || 0

  const imgSrc = product.image?.startsWith('/uploads')
    ? `${process.env.NEXT_PUBLIC_API_URL}${product.image}`
    : product.image || '/assets/images/best-product1.png'

  const productLink = `/product/${product.slug || product._id}`

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: displayPrice,
      img: imgSrc,
      pills: product.hasPillsOptions && product.pillsOptions?.[0]
        ? product.pillsOptions[0].count
        : product.badge || null,
      qty: 1,
    })
    addToast('Added to cart', 'cart')
  }

  const handleAddToWishlist = () => {
    addToWishlist({
      id: product._id,
      name: product.name,
      price: displayPrice,
      img: imgSrc,
      pills: product.badge || '',
    })
    addToast('Added to wishlist', 'wishlist')
  }

  if (layout === 'category') {
    return (
      <div className="product-card">
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <div className="product-card-image">
          <Link href={productLink}>
            <img loading="lazy" src={imgSrc} alt={product.name} />
          </Link>
          <button className="wishlist-btn" title="Add to wishlist" onClick={handleAddToWishlist}>
            <i className={isInWishlist ? 'fa-solid fa-heart' : 'fa-regular fa-heart'} />
          </button>
        </div>
        <div className="product-card-body">
          <span className="product-tag">{product.badge || product.category?.name}</span>
          <h3><Link href={productLink}>{product.name}</Link></h3>
          {product.shortDescription && (
            <p className="product-desc">{product.shortDescription}</p>
          )}
          <div className="product-rating">
            <div className="stars">
              {[1, 2, 3, 4, 5].map((s) => (
                <i key={s} className={s <= Math.floor(product.rating || 0) ? 'fa-solid fa-star' : 'fa-regular fa-star'} />
              ))}
            </div>
            <span className="rating-text">
              {(product.rating || 0).toFixed(1)} <span>({product.numReviews || 0})</span>
            </span>
          </div>
          <div className="product-card-footer">
            <span className="product-price">${displayPrice.toFixed(2)}</span>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to cart</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6 d-flex">
      <div className="premium-card w-100">
        <div className="premium-card-img">
          <Link href={productLink}>
            <figure className="mb-0">
              <img loading="lazy" src={imgSrc} alt={product.name} className="img-fluid" />
            </figure>
          </Link>
          {product.badge && <div className="premium-card-badge">{product.badge}</div>}
          <button className="premium-card-wishlist" aria-label="Add to wishlist" onClick={handleAddToWishlist}>
            <i className={isInWishlist ? 'fa-solid fa-heart' : 'fa-regular fa-heart'} />
          </button>
        </div>
        <div className="premium-card-body">
          <div className="premium-card-rating">
            <i className="fa-solid fa-star" />
            <span>{product.rating ? `${product.rating.toFixed(1)}/5` : '0/5'}</span>
          </div>
          <h5 className="premium-card-title">
            <Link href={productLink}>{product.name}</Link>
          </h5>
          <div className="premium-card-footer">
            <span className="premium-card-price">${displayPrice.toFixed(2)}</span>
            <button className="premium-card-cart" aria-label="Add to cart" onClick={handleAddToCart} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
              <i className="fa-solid fa-cart-plus" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard

