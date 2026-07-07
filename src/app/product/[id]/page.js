'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { usePageMeta } from '../../../context/SeoContext'
import { useCart } from '../../../context/CartContext'
import { useWishlist } from '../../../context/WishlistContext'
import { useToast } from '../../../components/Toast'
import { useSingleProduct, useProducts } from '../../../hooks/useProducts'
import API from '../../../lib/api'
import { ProductSchema, BreadcrumbSchema } from '../../../components/Seo/SchemaMarkup'

export default function SingleProduct() {
  const { id } = useParams()
  const { product, loading, error } = useSingleProduct(id)
  const { products: relatedProducts } = useProducts({ limit: 8 })
  const navigate = useRouter()

  usePageMeta(
    product?.name ? `${product.name} - Buy Online` : 'Product Details',
    product?.shortDescription || product?.description?.slice(0, 160) || 'View product details',
    product ? [product.name, product.badge, 'buy online'].filter(Boolean).join(', ') : undefined,
    `/product/${id}`,
    product?.image?.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL || ''}${product.image}` : product?.image || undefined
  )

  const [selectedPillsIdx, setSelectedPillsIdx] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [reviewStars, setReviewStars] = useState(0)
  const [reviewComment, setReviewComment] = useState('')

  const { addToCart } = useCart()
  const { addToWishlist, wishlist } = useWishlist()
  const { addToast } = useToast()

  if (loading) {
    return (
      <div className="sp-state sp-state-loading">
        <i className="fa-solid fa-spinner fa-spin sp-state-icon-lg" />
        <p>Loading product...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="sp-state">
        <h3 className="sp-state-error-title">Product not found</h3>
        <Link href="/shop" className="sp-add-cart">Back to Shop</Link>
      </div>
    )
  }

  const hasPills = product.hasPillsOptions && product.pillsOptions?.length > 0
  const currentOption = hasPills ? product.pillsOptions[selectedPillsIdx] : null
  const displayPrice = currentOption ? currentOption.price : product.price || 0
  const displayOldPrice = currentOption ? currentOption.oldPrice : product.oldPrice || 0

  const imgSrc = product.image?.startsWith('/uploads')
    ? `${process.env.NEXT_PUBLIC_API_URL}${product.image}`
    : product.image || '/assets/images/best-product1.png'

  const isInWishlist = wishlist.find((w) => w.id === product._id)

  const handleAddToCart = () => {
    addToCart({
      id: product._id, name: product.name, price: displayPrice,
      pills: currentOption ? currentOption.count : null, img: imgSrc, qty: quantity,
    })
    addToast('Added to cart', 'cart')
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate.push('/checkout')
  }

  const handleAddToWishlist = () => {
    addToWishlist({
      id: product._id, name: product.name, price: displayPrice,
      img: imgSrc, pills: product.badge || '',
    })
    addToast('Added to wishlist', 'wishlist')
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://painomed.us'

  return (
    <>
      <ProductSchema product={product} />
      <BreadcrumbSchema items={[
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: product.name, path: `/product/${id}` },
      ]} />
      <div className="single-product-page">
        <div className="container">
          <div className="sp-banner">
            <h1>{product.name}</h1>
            <p>Get the care you need, delivered fast and safely — trusted medicine, right to your doorstep.</p>
            <div className="breadcrumb">
              <span className="breadcrumb-item"><Link href="/">Home</Link></span>
              <span className="breadcrumb-item"><Link href="/shop">Shop</Link></span>
              <span className="breadcrumb-item active" aria-current="page">{product.name}</span>
            </div>
          </div>

          <div className="sp-layout">
            <div className="sp-image-col">
              <div className="sp-image-box">
                <figure><img loading="lazy" src={imgSrc} alt={product.name} /></figure>
              </div>
            </div>
            <div className="sp-info-col">
              <div className="sp-rating">
                {[1, 2, 3, 4, 5].map((s) => (
                  <i key={s} className={s <= Math.floor(product.rating || 0) ? 'fa-solid fa-star' : 'fa-regular fa-star'} />
                ))}
                <span>({(product.rating || 0).toFixed(1)}/5)</span>
                <span className="stock-badge in-stock"><i className="fa-solid fa-circle" /> In Stock</span>
              </div>
              <span className="sp-category">{product.badge || product.category?.name}</span>
              <h2 className="sp-name">{product.name}</h2>
              <div className="sp-price-row">
                <span className="sp-current-price">${displayPrice.toFixed(2)}</span>
                {displayOldPrice > 0 && <span className="sp-old-price">${displayOldPrice.toFixed(2)}</span>}
              </div>
              <p className="sp-desc">{product.shortDescription || product.description}</p>

              {hasPills && (
                <div className="sp-pills">
                  <span className="sp-pills-label">Select Pills:</span>
                  <div className="sp-pills-options">
                    {product.pillsOptions.map((opt, i) => (
                      <button key={opt.count} className={'sp-pill-btn' + (selectedPillsIdx === i ? ' active' : '')}
                        onClick={() => setSelectedPillsIdx(i)}>{opt.count} Pills</button>
                    ))}
                  </div>
                </div>
              )}

              <div className="sp-qty-row">
                <div className="sp-qty-control">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)}>+</button>
                </div>
                <button className="sp-add-cart" onClick={handleAddToCart}>Add to Cart</button>
                <button className="sp-buy-now" onClick={handleBuyNow}>Buy Now</button>
              </div>

              <div className="sp-actions">
                <span className="sp-wishlist-trigger" onClick={handleAddToWishlist}>
                  <i className={isInWishlist ? 'fa-solid fa-heart' : 'fa-regular fa-heart'} /> Add to wishlist
                </span>
              </div>

              <div className="sp-meta">
                {product.sku && <div><i className="fa-solid fa-tag" /> <strong>SKU:</strong> {product.sku}</div>}
                <div><i className="fa-solid fa-layer-group" /> <strong>Category:</strong> {product.category?.name || 'General'}</div>
                <div><i className="fa-solid fa-building" /> <strong>Brand:</strong> {product.brand || 'Painomed Healthcare'}</div>
              </div>

              <div className="sp-detail-icons">
                <div className="sp-detail-item">
                  <img loading="lazy" src="/assets/images/product-icon1.png" alt="Free Worldwide Shipping" />
                  <span>Free all over USA Shipping on All Orders Over $250</span>
                </div>
                <div className="sp-detail-item">
                  <img loading="lazy" src="/assets/images/product-icon2.png" alt="Delivery Information" />
                  <span>Delivers In: 3-5 Working Days <Link href="/terms-of-use">Terms &amp; Conditions</Link></span>
                </div>
              </div>
            </div>
          </div>

          <section className="sp-section">
            <h2 className="sp-section-heading">Description</h2>
            <div className="sp-section-body">
              <div className="sp-pre-line" dangerouslySetInnerHTML={{ __html: product.description }} />
              {product.ingredients && (<><h4>Ingredients</h4><p className="sp-pre-line">{product.ingredients}</p></>)}
            </div>
          </section>

          {product.howToUse && (
            <section className="sp-section">
              <h2 className="sp-section-heading">How to Use</h2>
              <div className="sp-section-body"><p className="sp-pre-line">{product.howToUse}</p></div>
            </section>
          )}

          {product.sideEffects && (
            <section className="sp-section">
              <h2 className="sp-section-heading">Side Effects</h2>
              <div className="sp-section-body"><p className="sp-pre-line">{product.sideEffects}</p></div>
            </section>
          )}

          {product.additionalInfo && (
            <section className="sp-section">
              <h2 className="sp-section-heading">Additional Information</h2>
              <div className="sp-section-body"><p className="sp-pre-line">{product.additionalInfo}</p></div>
            </section>
          )}

          <section className="sp-section">
            <h2 className="sp-section-heading">Customer Reviews</h2>
            <div className="sp-section-body">
              {product.reviews?.length === 0 && <p className="sp-no-reviews">No reviews yet. Be the first!</p>}
              {product.reviews?.map((review, i) => (
                <div key={i} className="sp-review">
                  <div className="sp-review-avatar">
                    {review.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="sp-review-body">
                    <div className="sp-review-header">
                      <div><h5>{review.name}</h5><span className="sp-review-badge verified"><i className="fa-solid fa-circle-check" /> Verified Buyer</span></div>
                      <span className="sp-review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="sp-review-stars">
                      {[1, 2, 3, 4, 5].map((s) => (<i key={s} className={s <= review.rating ? 'fa-solid fa-star' : 'fa-regular fa-star'} />))}
                    </div>
                    <p>{review.comment}</p>
                  </div>
                </div>
              ))}
              <div className="sp-review-form">
                <h4>Write a Review</h4>
                <form onSubmit={async (e) => {
                    e.preventDefault()
                    if (!reviewStars || !reviewComment.trim()) { addToast('Please select rating and write a review', 'info'); return }
                    try {
                      await API.post(`/products/${product._id}/reviews`, { rating: reviewStars, comment: reviewComment })
                      addToast('Review submitted!', 'cart')
                      setReviewStars(0); setReviewComment('')
                    } catch (err) { addToast(err.response?.data?.message || 'Failed to submit review', 'info') }
                  }}>
                    <div className="sp-review-form-group">
                      <label>Rating</label>
                      <div className="sp-review-star-select">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <i key={s} className={s <= reviewStars ? 'fa-solid fa-star' : 'fa-regular fa-star'} onClick={() => setReviewStars(s)} />
                        ))}
                      </div>
                    </div>
                    <div className="sp-review-form-group">
                      <label>Your Review *</label>
                      <textarea rows={4} placeholder="Write your review here..." value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} />
                    </div>
                    <button type="submit" className="sp-submit-review">Submit Review <i className="fa-solid fa-arrow-right" /></button>
                  </form>
              </div>
            </div>
          </section>

          {relatedProducts.length > 0 && (
            <section className="sp-section">
              <h2 className="sp-section-heading sp-section-heading-center">Explore More Products</h2>
              <div className="sp-more-grid">
                {relatedProducts.filter(p => p._id !== product._id).slice(0, 8).map((prod) => {
                  const pImg = prod.image?.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL}${prod.image}` : prod.image || '/assets/images/best-product1.png'
                  const pPrice = prod.hasPillsOptions && prod.pillsOptions?.[0] ? prod.pillsOptions[0].price : prod.price || 0
                  return (
                    <div key={prod._id} className="sp-more-card">
                      <Link href={`/product/${prod.slug || prod._id}`}>
                        <div className="sp-more-img"><figure><img loading="lazy" src={pImg} alt={prod.name} /></figure></div>
                      </Link>
                      <div className="sp-more-info">
                        <span className="sp-more-type">{prod.badge || prod.category?.name}</span>
                        <h5><Link href={`/product/${prod.slug || prod._id}`}>{prod.name}</Link></h5>
                        <div className="sp-more-rating"><i className="fa-solid fa-star" /><span>{(prod.rating || 0).toFixed(1)}/5</span></div>
                        <div className="sp-more-footer"><span className="sp-more-price">${pPrice.toFixed(2)}</span></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  )
}

