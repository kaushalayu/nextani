'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import API from '../lib/api'

function Footer() {
  const [footerText, setFooterText] = useState('')
  const [seo, setSeo] = useState(null)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    API.get('/seo')
      .then(({ data }) => {
        if (data.seo) {
          setSeo(data.seo)
          if (data.seo.footerText) setFooterText(data.seo.footerText)
        }
      })
      .catch(() => {})
  }, [])

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    try {
      await API.post('/newsletter', { email })
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    } catch {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  const waNumber = seo?.whatsappNumber || '61383766284'
  const phone = seo?.contactPhone || '+61 3 8376 6284'
  const supportEmail = seo?.supportEmail || 'support@painomed.com'
  const address = seo?.address || '21 King Street, Melbourne, 3000, Australia'
  const businessHours = seo?.businessHours || 'Mon - Sat: 9:00 am to 6:00 pm'
  const fb = seo?.socialLinks?.facebook || 'https://www.facebook.com/'
  const ig = seo?.socialLinks?.instagram || 'https://instagram.com/'
  const li = seo?.socialLinks?.linkedin || 'https://www.linkedin.com/'

  return (
    <>
    <Link href="/cart" className="cart-float" aria-label="View Cart">
      <i className="fa-solid fa-cart-shopping" />
    </Link>
    <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="whatsapp-float" aria-label="Chat on WhatsApp">
      <i className="fa-brands fa-whatsapp" />
    </a>
    <div className="padding-rl float-left w-100">
      <section className="float-left w-100 footer-con position-relative br-30 padding-rl-responsive">
        <div className="main-container position-relative">
          <div className="middle_portion">
            <div className="row align-items-center">
              <div className="col-lg-6 col-md-12 col-sm-12 col-12">
                <div className="logo-content">
                  <Link href="/" className="footer-logo d-flex align-items-center">
                    <img loading="lazy" src="/assets/images/footer-icon.png" alt="Painomed" className="d-inline-block" />
                    <span className="text-white d-inline-block special-heading1">Painomed.</span>
                  </Link>
                  <h4 className="text-white">Subscribe to Our Newsletter:</h4>
                  {subscribed ? (
                    <p style={{ color: '#6ee7b7', fontSize: 14, marginTop: 8 }}>Thank you for subscribing!</p>
                  ) : (
                    <form onSubmit={handleSubscribe}>
                      <div className="form-group position-relative mb-0">
                        <input type="email" className="form_style" placeholder="Enter Email Address" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <button type="submit"><i className="fa-solid fa-paper-plane" /></button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
              <div className="col-lg-2 col-md-6 col-sm-6 col-12">
                <div className="links">
                  <h4 className="heading">Navigation</h4>
                  <ul className="list-unstyled mb-0">
                    <li><i className="fa-solid fa-arrow-right" /><Link href="/" className="text-decoration-none">Home</Link></li>
                    <li><i className="fa-solid fa-arrow-right" /><Link href="/about" className="text-decoration-none">About</Link></li>
                    <li><i className="fa-solid fa-arrow-right" /><Link href="/shop" className="text-decoration-none">Shop</Link></li>
                    <li><i className="fa-solid fa-arrow-right" /><Link href="/shop" className="text-decoration-none">Team</Link></li>
                    <li><i className="fa-solid fa-arrow-right" /><Link href="/blog" className="text-decoration-none">Blog</Link></li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                <div className="contact">
                  <h4 className="heading">Contact Info</h4>
                  <ul className="list-unstyled mb-0">
                    <li className="text">
                      <i className="fa-solid fa-phone-flip" />
                      <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-decoration-none">{phone}</a>
                    </li>
                    <li className="text">
                      <i className="fa-solid fa-envelope" />
                      <a href={`mailto:${supportEmail}`} className="text-decoration-none">{supportEmail}</a>
                    </li>
                    <li className="text">
                      <i className="fa-solid fa-location-dot" />
                      <a className="address mb-0" href="https://maps.app.goo.gl/H8B9kcfVpLPDYcH89">{address}</a>
                    </li>
                    <li className="text">
                      <i className="fa-solid fa-clock" />
                      <p className="address mb-0">{businessHours}</p>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-1 col-md-12 col-sm-12 col-12">
                <div className="icon">
                  <ul className="list-unstyled mb-0 social-icons">
                    <li><a href={fb} className="text-decoration-none"><i className="fa-brands fa-facebook-f social-networks" /></a></li>
                    <li><a href={ig} className="text-decoration-none"><i className="fa-brands fa-instagram social-networks" aria-hidden="true" /></a></li>
                    <li><a href={li} className="text-decoration-none"><i className="fa-brands fa-linkedin social-networks" /></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="copyright d-flex justify-content-between align-items-center padding-rl-responsive">
            <p className="mb-0">{footerText || 'Copyright © 2025 painomed. All Rights Reserved.'}</p>
            <img loading="lazy" src="/assets/images/payment-cards.png" alt="Payment Cards" className="img-fluid" />
          </div>
        </div>
      </section>
    </div>
    </>
  )
}

export default Footer

