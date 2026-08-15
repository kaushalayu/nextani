'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePageMetaFromAdmin } from '../../context/SeoContext'
import API from '../../lib/api'
import SubBanner from '../../components/SubBanner'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useToast } from '../../components/Toast'
import InfoSection from '../../components/InfoSection'
import JsonLd from '../../components/JsonLd'

const servicesSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': 'https://painomed.us/services/#webpage',
      url: 'https://painomed.us/services/',
      name: 'Healthcare Services | Painomed',
      description: 'Explore Painomed healthcare services including no-prescription ordering, healthcare product assistance, delivery and customer support.',
      isPartOf: { '@id': 'https://painomed.us/#website' },
      inLanguage: 'en-US',
    },
    {
      '@type': 'Service',
      '@id': 'https://painomed.us/services/#no-prescription-ordering',
      name: 'No Prescription Required Ordering',
      description: 'Order eligible medicines online without a prescription, with fast and discreet delivery across the USA.',
      provider: { '@type': 'Organization', name: 'Painomed', url: 'https://painomed.us/' },
      areaServed: 'United States',
    },
    {
      '@type': 'Service',
      '@id': 'https://painomed.us/services/#healthcare-delivery-support',
      name: 'Healthcare Delivery & Customer Support',
      description: 'Convenient delivery and customer support for eligible healthcare products and orders.',
      provider: { '@type': 'Organization', name: 'Painomed', url: 'https://painomed.us/' },
      areaServed: 'United States',
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://painomed.us/services/#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://painomed.us/' },
        { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://painomed.us/services/' },
      ],
    },
  ],
}

export default function Services() {
  usePageMetaFromAdmin('/services', 'Healthcare Services', "Explore Painomed's healthcare services — fast medicine delivery and no prescription required across the USA.")

  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [productCount, setProductCount] = useState(0)
  const [activeTab, setActiveTab] = useState('all')
  const { addToCart } = useCart()
  const { addToWishlist } = useWishlist()
  const { addToast } = useToast()

  useEffect(() => {
    API.get('/services').then(({ data }) => setServices(data.services || [])).catch(() => {})
    API.get('/categories').then(({ data }) => setCategories(data.categories || [])).catch(() => {})
    API.get('/products?limit=20').then(({ data }) => {
      setFeaturedProducts(data.products || [])
      if (data.total) setProductCount(data.total)
    }).catch(() => {})
  }, [])

  const avgRating = featuredProducts.length > 0
    ? (featuredProducts.reduce((sum, p) => sum + (p.rating || 0), 0) / featuredProducts.length).toFixed(0)
    : 99

  const filteredByCategory = (catName) =>
    catName === 'all' ? featuredProducts
      : featuredProducts.filter((p) => {
          const c = p.category
          return c && (c.name === catName || c.slug === catName.toLowerCase().replace(/\s+/g, '-'))
        })

  const productImg = (product) => {
    if (!product.image) return '/assets/images/product1.png'
    if (product.image.startsWith('/uploads')) return `${process.env.NEXT_PUBLIC_API_URL}${product.image}`
    return product.image
  }

  const productLink = (product) => `/product/${product.slug || product._id}`
  const truncate = (str, len) => (str && str.length > len ? str.slice(0, len) + '...' : str)

  return (
    <>
      <SubBanner title="Services" description="Trusted source for medicines and healthcare products with no prescription required — delivered with care and confidence across the USA." page="Services" />

      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 srv-intro-con">
          <div className="main-container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="srv-intro-content">
                  <span className="srv-section-tag">What We Offer</span>
                  <h2>Comprehensive <span>Healthcare</span> Services</h2>
                  <p>From pain relief and anxiety medicines to wellness supplements, we provide end-to-end pharmaceutical care with expert guidance, fast delivery across the USA, and no prescription required for eligible products — because your health is our priority.</p>
                  <div className="srv-intro-stats">
                    <div className="srv-stat-item">
                      <span className="srv-stat-num">{services.length > 0 ? services.length + '+' : '5+'}</span>
                      <span className="srv-stat-label">Services</span>
                    </div>
                    <div className="srv-stat-item">
                      <span className="srv-stat-num">{productCount > 0 ? productCount + '+' : '30+'}</span>
                      <span className="srv-stat-label">Products</span>
                    </div>
                    <div className="srv-stat-item">
                      <span className="srv-stat-num">{avgRating}%</span>
                      <span className="srv-stat-label">Satisfaction</span>
                    </div>
                  </div>
                  <Link href="/shop" className="srv-primary-btn">Explore Products <i className="fa-solid fa-arrow-right" /></Link>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="srv-intro-image">
                  <div className="srv-intro-img-wrap">
                    <img src="/assets/images/popular-category1.jpg" alt="Healthcare" className="img-fluid srv-intro-main-img" />
                    <div className="srv-intro-img-overlay" />
                  </div>
                  <div className="srv-intro-badge"><i className="fa-solid fa-truck" /><span>Free Worldwide Delivery</span></div>
                  <div className="srv-intro-badge srv-intro-badge-support"><i className="fa-solid fa-headset" /><span>24/7 Support</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 srv-cards-con">
          <div className="main-container">
            <div className="text-center">
              <span className="srv-section-tag">Our Services</span>
              <h2>Everything You Need <span>Under One Roof</span></h2>
              <p className="srv-cards-desc">We cover every aspect of your pharmaceutical needs with care and professionalism</p>
            </div>
            {services.length === 0 ? (
              <div className="srv-state">
                <i className="fa-solid fa-spinner fa-spin srv-state-icon" />
                <p>Loading services...</p>
              </div>
            ) : (
              <div className="row">
                {services.map((service) => (
                  <div key={service._id} className="col-lg-4 col-md-6">
                    <div className="srv-card">
                      <div className="srv-card-icon"><i className={service.icon || 'fa-solid fa-hand-holding-heart'} /></div>
                      <h4>{service.title}</h4>
                      <p>{service.description}</p>
                      <Link href="/shop">Learn More <i className="fa-solid fa-arrow-right" /></Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <InfoSection
        tag="No Prescription Required"
        title="Order Medicines Without a Prescription"
        content="No prescription required for eligible medicines at Painomed. Simply browse, add to cart, and checkout — we handle the rest and deliver fast and discreetly across the USA."
        bullets={[
          'No Prescription Required',
          'Fast Discreet Delivery',
          'Secure Online Ordering',
          '24/7 Customer Support',
        ]}
        cta={{ href: '/shop', label: 'Shop Medicines' }}
        image="/assets/images/work-img.jpg"
        imageAlt="Order medicines without a prescription at Painomed"
        reverse
      />

      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 srv-support-con">
          <div className="main-container">
            <div className="text-center srv-support-head">
              <span className="srv-section-tag">Healthcare Delivery &amp; Support</span>
              <h2>Reliable Healthcare Delivery &amp; Support</h2>
              <p className="srv-support-desc">From placing your order to receiving it, Painomed aims to provide a convenient and customer-focused experience. Our team is available to assist with product enquiries, order-related questions, and the purchasing process.</p>
            </div>
            <div className="row">
              {[
                { icon: 'fa-solid fa-truck-fast', title: 'Convenient Delivery', desc: 'Eligible healthcare products delivered to your selected address.' },
                { icon: 'fa-solid fa-headset', title: 'Customer Support', desc: 'Get assistance with products, orders, and general enquiries.' },
                { icon: 'fa-solid fa-shield-halved', title: 'Secure Ordering', desc: 'A secure and convenient experience for browsing and placing eligible orders.' },
              ].map((card) => (
                <div key={card.title} className="col-lg-4 col-md-6">
                  <div className="srv-support-card">
                    <span className="srv-support-icon"><i className={card.icon} /></span>
                    <h3>{card.title}</h3>
                    <p className="mb-0">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center srv-support-cta">
              <Link href="/contact" className="srv-primary-btn">Contact Our Team <i className="fa-solid fa-arrow-right" /></Link>
            </div>
          </div>
        </section>
      </div>

      <JsonLd data={servicesSchema} />

      <div className="padding-rl float-left w-100">
        <section className="position-relative padding-top padding-bottom services-featured-section">
          <div className="main-container">
            <div className="services-featured-header text-center">
              <span className="services-featured-tag">Best Items</span>
              <h2 className="mb-0">Our Featured Products</h2>
              <p className="services-featured-desc">Premium healthcare solutions tailored to your needs</p>
            </div>
            {featuredProducts.length === 0 ? (
              <div className="srv-state">
                <i className="fa-solid fa-spinner fa-spin srv-state-icon" />
                <p>Loading featured products...</p>
              </div>
            ) : (
              <div className="services-featured-tabs">
                <div className="services-tab-nav">
                  <a className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>All</a>
                  {categories.map((cat) => (
                    <a key={cat._id} className={activeTab === cat.name ? 'active' : ''} onClick={() => setActiveTab(cat.name)}>{cat.name}</a>
                  ))}
                </div>
                <div className="services-tab-content">
                  <div className="services-tab-pane active">
                    <div className="row">
                      {filteredByCategory(activeTab).slice(0, 8).map((product) => {
                        const displayPrice = product.hasPillsOptions && product.pillsOptions?.length > 0
                          ? product.pillsOptions[0].price : product.price || 0
                        return (
                          <div key={product._id} className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 d-flex">
                            <div className="premium-card w-100">
                              <div className="premium-card-img">
                                <Link href={productLink(product)}>
                                  <figure className="mb-0"><img src={productImg(product)} alt={product.name} className="img-fluid" /></figure>
                                </Link>
                                {product.badge && <div className="premium-card-badge">{product.badge}</div>}
                                <button className="premium-card-wishlist" aria-label="Add to wishlist" onClick={() => { addToWishlist({ id: product._id, name: product.name, price: displayPrice, img: productImg(product), pills: product.badge || '' }); addToast('Added to wishlist', 'success') }}><i className="fa-regular fa-heart" /></button>
                              </div>
                              <div className="premium-card-body">
                                <div className="premium-card-rating">
                                  <i className="fa-solid fa-star" />
                                  <span>{product.rating ? `${product.rating.toFixed(1)}/5` : '0/5'}</span>
                                </div>
                                <h5 className="premium-card-title"><Link href={productLink(product)}>{truncate(product.name, 30)}</Link></h5>
                                <div className="premium-card-footer">
                                  <span className="premium-card-price">${displayPrice.toFixed(2)}</span>
                                  <button className="premium-card-cart srv-card-cart-btn" aria-label="Add to cart" onClick={() => { addToCart({ id: product._id, name: product.name, price: displayPrice, img: productImg(product), pills: product.badge || '', qty: 1 }); addToast('Added to cart', 'cart') }}><i className="fa-solid fa-cart-plus" /></button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      {filteredByCategory(activeTab).length === 0 && (
                        <div className="srv-state srv-state-empty"><p>No products found in this category.</p></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
