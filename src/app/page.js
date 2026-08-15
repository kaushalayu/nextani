'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useProducts } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { usePageMetaFromAdmin, useSeo } from '../context/SeoContext'
import API from '../lib/api'
import { makeExcerpt } from '../lib/utils'
import FaqAccordion from '../components/FaqAccordion'
import JsonLd from '../components/JsonLd'

const CATEGORY_ROUTES = {
  'Sleeping Pills': '/sleeping-pills',
  'Painkillers': '/painkillers',
  'Anxiety Pills': '/anxiety',
}

const tabData = [
  { id: 'all', label: 'All' },
  { id: 'anxiety', label: 'Anxiety Pills', badge: 'calm' },
  { id: 'painkillers', label: 'Painkillers', badge: 'painkiller' },
  { id: 'sleeping', label: 'Sleeping Pills', badge: 'sleep aid' },
]

const whyChooseUs = [
  { icon: '/assets/images/product-icon1.png', title: 'Certified Pharmacists', desc: 'Licensed experts ensure every order is safe, verified, and trusted.' },
  { icon: '/assets/images/product-icon2.png', title: '100% Quality Assured', desc: 'All medicines are sourced from verified & trusted manufacturers.' },
  { icon: '/assets/images/benefits-icon1.png', title: 'Free Fast Delivery', desc: 'Get your order delivered anywhere across the USA — absolutely free.' },
  { icon: '/assets/images/benefits-icon4.png', title: '24/7 Customer Care', desc: 'Our support team is available round the clock to help you.' },
]

const processSteps = [
  { icon: '/assets/images/work-icon2.png', title: 'Choose Your Products', desc: 'Browse and select the medicines or health products you need from our extensive catalog.' },
  { icon: '/assets/images/work-icon3.png', title: 'No Prescription Required', desc: 'Order eligible medicines without a prescription — simple, fast, and discreet.' },
  { icon: '/assets/images/capsule-icon.png', title: 'Get It Delivered', desc: 'Receive your order at your doorstep — fast, safe, and hassle-free.' },
]

const homeFaqs = [
  { question: 'What is Painomed?', answer: 'Painomed is an online pharmacy platform offering medicines, healthcare products, wellness products, and convenient online ordering services.' },
  { question: 'Do I need a prescription to order medicines from Painomed?', answer: 'No prescription required for eligible medicines at Painomed. Just add your items to the cart and checkout — no uploads, no waiting.' },
  { question: 'Do I need to upload a prescription?', answer: 'No. Most medicines at Painomed can be ordered without a prescription for fast, hassle-free delivery across the USA.' },
  { question: 'How can I search for a medicine on Painomed?', answer: 'Use the website search bar to search by product name, medicine name, or category and explore the available products.' },
  { question: 'How long does Painomed delivery take?', answer: 'Delivery time can vary depending on product availability, order verification, delivery location, and shipping method. Check the applicable delivery information during checkout.' },
  { question: 'How can I track my Painomed order?', answer: 'Once your order has been processed and shipped, you can use the available order tracking option and tracking details provided with your order.' },
  { question: 'Is online payment secure on Painomed?', answer: 'Painomed provides a secure checkout experience through its available payment processing system. Always ensure you are using the official Painomed website when placing an order.' },
  { question: 'Can I cancel or return my order?', answer: 'Cancellation and return eligibility depends on the order status, product type, and applicable Painomed policies. Please review the relevant policy before requesting a cancellation or return.' },
  { question: 'How can I contact Painomed customer support?', answer: 'You can contact the Painomed support team through the contact details provided on the website for assistance with orders, products, and general enquiries.' },
  { question: 'Are all medicines available for online purchase?', answer: 'Yes — most of our medicines are available for online purchase with no prescription required. Just add to cart and checkout for fast delivery across the USA.' },
]

const homeSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://painomed.us/#organization',
      name: 'Painomed',
      url: 'https://painomed.us/',
      logo: '/logo.png',
      description: 'Painomed is an online pharmacy providing convenient access to medicines, healthcare products, wellness products and healthcare solutions.',
      email: 'support@painomed.com',
      telephone: '+1 212 555 0134',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://painomed.us/#website',
      url: 'https://painomed.us/',
      name: 'Painomed',
      publisher: { '@id': 'https://painomed.us/#organization' },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: 'https://painomed.us/?s={search_term_string}' },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'WebPage',
      '@id': 'https://painomed.us/#webpage',
      url: 'https://painomed.us/',
      name: 'Painomed – Online Pharmacy',
      description: 'Shop medicines, healthcare products and wellness products online with Painomed.',
      isPartOf: { '@id': 'https://painomed.us/#website' },
      about: { '@id': 'https://painomed.us/#organization' },
      inLanguage: 'en-US',
    },
  ],
}

function Toast({ message, type }) {
  return (
    <div className={`toast-notification toast-${type}`}>
      <i className={`fa-solid ${type === 'cart' ? 'fa-cart-shopping' : 'fa-heart'}`}></i>
      {message}
    </div>
  )
}

function StarRating({ rating }) {
  const stars = rating || 0
  return (
    <div className="star-rating">
      {[...Array(5)].map((_, i) => (
        <i key={i} className={i < Math.floor(stars) ? 'fa-solid fa-star' : 'fa-regular fa-star'}></i>
      ))}
      <span>{stars}/5</span>
    </div>
  )
}

function getProductImg(img) {
  if (!img) return '/assets/images/best-product1.png'
  if (img.startsWith('/uploads')) return `${process.env.NEXT_PUBLIC_API_URL}${img}`
  if (img.startsWith('http')) return img
  return img.startsWith('/') ? img : '/' + img
}

function ProductCard({ product, onAddToCart, onAddToWishlist }) {
  const price = product.hasPillsOptions && product.pillsOptions?.[0]
    ? product.pillsOptions[0].price : product.price || 0
  const productId = product._id || product.id
  const productSlug = product.slug || productId

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <Link href={productId ? `/product/${productSlug}` : '/shop'}>
          <img loading="lazy" src={getProductImg(product.image || product.img)} alt={product.name} />
        </Link>
        <span className="product-badge">{product.category?.name || product.badge || product.type}</span>
        <button className="wishlist-btn" onClick={() => onAddToWishlist(product)}><i className="fa-regular fa-heart"></i></button>
      </div>
      <div className="product-info">
        <span className="product-name">
          <Link href={productId ? `/product/${productSlug}` : '/shop'}>{product.name}</Link>
        </span>
        <StarRating rating={product.ratings || product.rating} />
        <div className="product-price-row">
          <span className="product-price">${price.toFixed ? price.toFixed(2) : price}.00</span>
          <button className="add-to-cart-btn" onClick={() => onAddToCart(product)}>Add to cart</button>
        </div>
      </div>
    </div>
  )
}

function TestimonialCarousel({ testimonials }) {
  const [current, setCurrent] = useState(0)
  const items = testimonials.length > 0 ? testimonials : [
    { name: 'Jennifer Troyer', role: 'Administrator', img: '/assets/images/client-img1.jpg', text: 'Great service!', rating: 5 },
  ]

  useEffect(() => {
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % items.length), 5000)
    return () => clearInterval(timer)
  }, [items.length])

  const goTo = useCallback((idx) => setCurrent(idx), [])
  const prev = useCallback(() => setCurrent(c => (c === 0 ? items.length - 1 : c - 1)), [items.length])
  const next = useCallback(() => setCurrent(c => (c + 1) % items.length), [items.length])

  return (
    <div className="carousel slide">
      <div className="carousel-inner">
        {items.map((client, i) => (
          <div className={`carousel-item${i === current ? ' active' : ''}`} key={client._id || i}>
            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(client.rating || 5)].map((_, si) => (<i key={si} className="fa-solid fa-star"></i>))}
              </div>
              <p className="testimonial-text">"{client.text}"</p>
              <div className="testimonial-author">
                <img loading="lazy" src={client.image?.startsWith('http') ? client.image : client.image?.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL}${client.image}` : client.img || '/assets/images/client-img1.jpg'} alt={client.name} />
                <div>
                  <p className="testimonial-name">{client.name}</p>
                  <span className="testimonial-role">{client.role}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="testimonial-dots">
        {items.map((_, i) => (
          <button key={i} className={`testimonial-dot${i === current ? ' active' : ''}`} onClick={() => goTo(i)} aria-label={`Go to slide ${i + 1}`} />
        ))}
      </div>
      <div className="testimonial-controls">
        <button className="testimonial-arrow testimonial-prev" onClick={prev} aria-label="Previous"><i className="fa-solid fa-arrow-left"></i></button>
        <button className="testimonial-arrow testimonial-next" onClick={next} aria-label="Next"><i className="fa-solid fa-arrow-right"></i></button>
      </div>
    </div>
  )
}

export default function Home() {
  usePageMetaFromAdmin('/', '', 'Buy pain relief, anxiety and sleep medicines online in the USA. No prescription required. Fast, discreet delivery from Painomed — your trusted online pharmacy.')
  const { seo } = useSeo()

  const [activeTab, setActiveTab] = useState('all')
  const [toast, setToast] = useState(null)
  const [blogPosts, setBlogPosts] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [homeCategories, setHomeCategories] = useState([])
  const { addToCart } = useCart()
  const { addToWishlist } = useWishlist()

  useEffect(() => {
    API.get('/blogs?limit=3').then(({ data }) => setBlogPosts(data.blogs || [])).catch(() => {})
    API.get('/testimonials').then(({ data }) => setTestimonials(data.testimonials || [])).catch(() => {})
    API.get('/categories?limit=4').then(({ data }) => setHomeCategories(data.categories || [])).catch(() => {})
  }, [])

  const activeBadge = tabData.find(t => t.id === activeTab)?.badge
  const featuredParams = useMemo(() => {
    const p = { isFeatured: true, limit: 8 }
    if (activeBadge) p.badge = activeBadge
    return p
  }, [activeBadge])
  const { products: featuredProducts, loading: featuredLoading } = useProducts(featuredParams)

  const bestSellerParams = useMemo(() => ({ isBestSeller: true, limit: 8 }), [])
  const { products: bestSellers, loading: bestLoading } = useProducts(bestSellerParams)

  function showToast(type, productName) {
    setToast({ type, message: type === 'cart' ? `${productName} added to cart` : `${productName} added to wishlist` })
    setTimeout(() => setToast(null), 2500)
  }

  function handleAddToCart(product) {
    const price = product.hasPillsOptions && product.pillsOptions?.[0] ? product.pillsOptions[0].price : product.price || 0
    addToCart({
      id: product._id || product.id, name: product.name, price,
      img: product.image || product.img || '', qty: 1,
    })
    showToast('cart', product.name)
  }

  function handleAddToWishlist(product) {
    addToWishlist({
      id: product._id || product.id, name: product.name,
      price: product.price || 0, img: product.image || product.img || '',
    })
    showToast('wishlist', product.name)
  }

  const ProductSkeleton = () => (
    <div className="product-card skeleton-card">
      <div className="skel-img" />
      <div className="skel-body">
        <div className="skel-line" />
        <div className="skel-line skel-line-short" />
      </div>
    </div>
  )

  return (
    <>
      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 hero-section position-relative d-flex align-items-center br-30">
          <div className="hero-bg-circle hero-bg-circle-1"></div>
          <div className="hero-bg-circle hero-bg-circle-2"></div>
          <div className="wrapper1560 position-relative">
            <div className="hero-content">
              <span className="hero-tag"><i className="fa-solid fa-circle-check"></i> Trusted Online Pharmacy</span>
              <h1 className="hero-title">Pain Relief and Anxiety<br />Medicine Online in USA</h1>
              <p className="hero-desc">Healthcare &amp; wellness products online at Painomed. Fast delivery in USA, Safe &amp; trusted pharmacy in USA.</p>
              <div className="hero-btns">
                <Link href="/shop" className="hero-btn-primary">Shop Medicines</Link>
              </div>
              <div className="hero-stats">
                <div className="hero-stat-item"><span className="hero-stat-num">10k+</span><span className="hero-stat-label">Happy Clients</span></div>
                <div className="hero-stat-item"><span className="hero-stat-num">500+</span><span className="hero-stat-label">Medicines</span></div>
                <div className="hero-stat-item"><span className="hero-stat-num">Free</span><span className="hero-stat-label">Delivery</span></div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="home-section section-best">
        <div className="home-container">
          <div className="section-header">
            <span className="section-subtitle">Most Demanding</span>
            <h2 className="section-title">Best Selling Products</h2>
          </div>
          <div className="product-grid">
            {bestLoading ? [...Array(8)].map((_, i) => <ProductSkeleton key={i} />)
              : bestSellers.length > 0
                ? bestSellers.map((product) => (
                    <ProductCard product={product} key={product._id}
                      onAddToCart={handleAddToCart} onAddToWishlist={handleAddToWishlist} />
                  ))
                : (<div className="home-empty">
                    <i className="fa-solid fa-box-open" />
                    <p>No best sellers yet. Add them from the admin panel.</p>
                  </div>)
            }
          </div>
        </div>
      </section>

      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 benefits-con">
          <div className="main-container">
            <div className="benefits-inner-con">
              <ul className="d-flex list-unstyled p-0 mb-0 align-items-center justify-content-between">
                <li className="position-relative d-flex align-items-center">
                  <figure><img loading="lazy" src="/assets/images/benefits-icon1.png" alt="Free Shipping" className="img-fluid" /></figure>
                  <div className="sub-info-inner"><span className="benefit-title">Free Shipping &amp; Returns</span><p className="mb-0 sub-p">For all order over $200</p></div>
                </li>
                <li className="position-relative d-flex align-items-center">
                  <figure><img loading="lazy" src="/assets/images/benefits-icon2.png" alt="Secure Payment" className="img-fluid" /></figure>
                  <div className="sub-info-inner"><span className="benefit-title">Secure Payment</span><p className="mb-0 sub-p">Ensure Secure Payment</p></div>
                </li>
                <li className="position-relative d-flex align-items-center">
                  <figure><img loading="lazy" src="/assets/images/benefits-icon3.png" alt="Money Back" className="img-fluid" /></figure>
                  <div className="sub-info-inner"><span className="benefit-title">Money Back Guarantee</span><p className="mb-0 sub-p">Returning Money in 30 days</p></div>
                </li>
                <li className="position-relative d-flex align-items-center">
                  <figure><img loading="lazy" src="/assets/images/benefits-icon4.png" alt="24/7 Support" className="img-fluid" /></figure>
                  <div className="sub-info-inner"><span className="benefit-title">24/7 Customer Support</span><p className="mb-0 sub-p">Friendly Customer Support</p></div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <section className="home-section section-categories">
        <div className="home-container">
          <div className="section-header">
            <span className="section-subtitle">Top Choices</span>
            <h2 className="section-title">Our Popular Categories</h2>
          </div>
          <div className="categories-grid">
            {homeCategories.length > 0 ? homeCategories.map((cat, i) => {
              const route = CATEGORY_ROUTES[cat.name] || '/shop'
              const imgSrc = cat.image
                ? (cat.image.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL}${cat.image}` : cat.image)
                : '/assets/images/popular-category1.jpg'
              return (
                <Link href={route} className="category-card" key={cat._id || i}>
                  <div className="category-image-wrapper">
                    <img loading="lazy" src={imgSrc} alt={cat.name} />
                    <div className="category-overlay"><span className="category-name">{cat.name}</span></div>
                  </div>
                </Link>
              )
            }) : [...Array(4)].map((_, i) => (
              <div className="category-card" key={i} style={{ opacity: 0.4 }}>
                <div className="category-image-wrapper">
                  <img loading="lazy" src={`/assets/images/popular-category${i + 1}.jpg`} alt={`Popular category ${i + 1}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section section-process">
        <div className="home-container">
          <div className="section-header">
            <span className="section-subtitle">Our Process</span>
            <h2 className="section-title">How It Works</h2>
          </div>
          <div className="process-grid">
            {processSteps.map((step, i) => (
              <div className="process-step" key={i}>
                <div className="step-number-badge">{String(i + 1).padStart(2, '0')}</div>
                <div className="step-icon-wrap"><img loading="lazy" src={step.icon} alt={step.title} /></div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="process-cta">
            <Link href="/shop" className="process-btn">Get Started Now</Link>
          </div>
        </div>
      </section>

      <section className="home-section section-featured">
        <div className="home-container">
          <div className="section-header">
            <span className="section-subtitle">Best Items</span>
            <h2 className="section-title">Our Featured Products</h2>
          </div>
          <div className="tab-buttons">
            {tabData.map((tab) => (
              <button key={tab.id} className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
            ))}
          </div>
          <div className="product-grid">
            {featuredLoading ? [...Array(4)].map((_, i) => <ProductSkeleton key={i} />)
              : featuredProducts.length > 0
                ? featuredProducts.map((product) => (
                    <ProductCard product={product} key={product._id}
                      onAddToCart={handleAddToCart} onAddToWishlist={handleAddToWishlist} />
                  ))
                : (<div className="home-empty">
                    <i className="fa-solid fa-box-open" />
                    <p>{activeBadge ? `No featured products in this category yet.` : 'No featured products yet. Add them from the admin panel.'}</p>
                  </div>)
            }
          </div>
        </div>
      </section>

      <section className="home-section section-why">
        <div className="home-container">
          <div className="section-header">
            <span className="section-subtitle">Why Trust Us</span>
            <h2 className="section-title">Why Trust Painomed</h2>
          </div>
          <div className="why-grid">
            {whyChooseUs.map((item, i) => (
              <div className="why-card" key={i}>
                <div className="why-icon-wrap"><img loading="lazy" src={item.icon} alt={item.title} /></div>
                <h3 className="why-title">{item.title}</h3>
                <p className="why-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section section-about">
        <div className="home-container">
          <div className="section-header">
            <span className="section-subtitle">About Us</span>
            <h2 className="section-title">About Painomed</h2>
          </div>
          <div className="home-about-grid">
            <div className="home-about-media">
              <img loading="lazy" src="/assets/images/main-abt-img1.jpg" alt="About Painomed — online pharmacy" />
            </div>
            <div className="home-about-text">
              <p>At Painomed, we believe that accessing healthcare products should be simple, convenient, and reliable. Our online pharmacy is designed to provide customers with a convenient way to explore medicines, healthcare products, wellness solutions, and everyday health essentials from the comfort of their homes.</p>
              <p>We understand that healthcare is personal, which is why we focus on creating a trustworthy and customer-friendly online experience. From browsing products and understanding ordering requirements to secure checkout and convenient delivery, we aim to make every step as simple and seamless as possible.</p>
              <p>Painomed offers a growing selection of pain relief medicines, anxiety medicines, sleep aids, wellness products, healthcare essentials, and other healthcare solutions — with no prescription required for eligible products.</p>
              <p>Our commitment goes beyond providing products. We focus on quality, convenience, fast delivery, and customer support. Our team works to provide helpful assistance with product enquiries, orders, and the overall shopping experience across the USA.</p>
              <p>At Painomed, our vision is to build a trusted online healthcare destination where customers can conveniently access the products and information they need. We continuously work to improve our platform, services, product selection, and customer experience as we grow.</p>
              <div className="home-about-commitment">
                <h3>Our Commitment</h3>
                <p className="home-about-caretag">Quality. Convenience. Trust. Care.</p>
                <p>Whether you are looking for everyday healthcare essentials, wellness products, pain relief solutions, or anxiety and sleep medicines, Painomed is here to make your online healthcare journey more convenient — with no prescription required and fast delivery across the USA.</p>
              </div>
              <p className="home-about-tagline">Painomed — Your Health, Delivered With Care.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 promotion-banner-con position-relative">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-4 col-md-6 d-flex">
                <div className="promotion-box w-100 vitamins" style={seo?.promoBanner1 ? { backgroundImage: `url(${getProductImg(seo.promoBanner1)})` } : {}}>
                  <span className="d-block discount-percent">10%</span>
                  <span className="d-block smol-text">OFF</span>
                  <h3 className="specialh4">Bitcoin &amp; <br />Crypto Payments</h3>
                  <Link href="/shop" className="text-decoration-none elementary_btn d-inline-block">Pay with Crypto</Link>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 d-flex">
                <div className="promotion-box w-100 baby-care" style={seo?.promoBanner2 ? { backgroundImage: `url(${getProductImg(seo.promoBanner2)})` } : {}}>
                  <span className="d-block discount-percent">20%</span>
                  <span className="d-block smol-text">OFF</span>
                  <h3 className="specialh4">Extra Savings<br />on Bitcoin</h3>
                  <Link href="/shop" className="text-decoration-none elementary_btn d-inline-block">Start Saving</Link>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 d-flex">
                <div className="promotion-box w-100 personal-care" style={seo?.promoBanner3 ? { backgroundImage: `url(${getProductImg(seo.promoBanner3)})` } : {}}>
                  <span className="d-block discount-percent">15%</span>
                  <span className="d-block smol-text">DISCOUNT</span>
                  <h3 className="specialh4">First Crypto<br />Order</h3>
                  <Link href="/shop" className="text-decoration-none elementary_btn d-inline-block">Order Now</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="spacer"></div>

      <section className="home-section section-testimonials">
        <div className="home-container">
          <div className="section-header">
            <span className="section-subtitle">Testimonials</span>
            <h2 className="section-title">Customer Reviews</h2>
          </div>
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      <section className="home-section section-blog">
        <div className="home-container">
          <div className="section-header">
            <span className="section-subtitle">News &amp; Articles</span>
            <h2 className="section-title">Latest Health &amp; Wellness Articles</h2>
          </div>
          <div className="blog-grid">
            {(blogPosts.length > 0 ? blogPosts : [
              { title: 'Loading...', excerpt: '', image: '/assets/images/news-and-articles-img1.jpg' },
            ]).map((post, i) => (
              <div className="blog-card" key={post._id || i}>
                <div className="blog-image-wrap">
                  <img loading="lazy" src={post.image?.startsWith('http') ? post.image : post.image?.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL}${post.image}` : post.img || '/assets/images/news-and-articles-img1.jpg'} alt={post.title} />
                  {post.category && <span className="blog-tag">{post.category}</span>}
                </div>
                <div className="blog-content">
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-excerpt">{makeExcerpt(post.excerpt || post.content, 120)}</p>
                  <Link href={`/blog/${post.slug || post._id}`} className="blog-link">Read More <i className="fa-solid fa-arrow-right"></i></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-faq-section">
        <div className="home-container">
          <div className="section-header">
            <span className="section-subtitle">Need Help?</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div className="home-faq-inner">
            <FaqAccordion items={homeFaqs} />
          </div>
        </div>
      </section>

      <JsonLd data={homeSchema} />

      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  )
}
