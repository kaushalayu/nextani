'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import API from '../../lib/api'
import SubBanner from '../../components/SubBanner'

export default function Contact() {
  const [seo, setSeo] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    API.get('/seo').then(({ data }) => { if (data.seo) setSeo(data.seo) }).catch(() => {})
  }, [])

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    if (error) setError('')
    if (success) setSuccess(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess(null)
    if (!form.name || !form.email || !form.message) { setError('Please fill in your name, email and message.'); return }
    setLoading(true)
    try {
      await API.post('/contact', form)
      setSuccess('Thank you! Your message has been sent successfully. We will get back to you within 24 hours.')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.')
    } finally { setLoading(false) }
  }

  const address = seo?.address || '121 King Street, Melbourne Victoria 3000 Australia'
  const supportEmail = seo?.supportEmail || 'support@pharmez.com'
  const contactPhone = seo?.contactPhone || '+61 3 8376 6284'
  const businessHours = seo?.businessHours || 'Monday–Friday, 9 am–6 pm'
  const mapUrl = seo?.mapEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.367176743588!2d144.95736461590413!3d-37.81813957974638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65cbce858f6d7%3A0x9cc486b305ba3fb1!2s21%20King%20St%2C%20Melbourne%20VIC%203000%2C%20Australia!5e0!3m2!1sen!2s!4v1669200882885!5m2!1sen!2s'

  return (
    <>
      <SubBanner title="Contact" description="Need help? We're here for you! Reach out with any questions about prescriptions, orders, or delivery—our team is ready to assist you quickly and reliably." page="Contact" />

      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 position-relative contact-info-con padding-top padding-bottom">
          <div className="main-container">
            <div className="heading-title-con text-center">
              <span className="special-text d-inline-block">Contact Info</span>
              <h2>Our Contact Information</h2>
            </div>
            <div className="row all_row">
              {[
                { img: '/assets/images/contact-location-icon.png', title: 'Our Location:', text: address },
                { img: '/assets/images/contact-email-icon.png', title: 'Email us at:', text: supportEmail, href: `mailto:${supportEmail}` },
                { img: '/assets/images/contact-phone-icon.png', title: 'Phone:', text: contactPhone, href: `tel:${contactPhone.replace(/\s/g, '')}` },
                { img: '/assets/images/contact-open-hours.png', title: 'Open Hours:', text: businessHours },
              ].map((item, i) => (
                <div key={i} className="col-lg-3 col-md-6 all_column">
                  <div className="contact-info-box d-flex w-100">
                    <figure><img src={item.img} alt={item.title} className="img-fluid" /></figure>
                    <div className="contact-sub-con">
                      <h6>{item.title}</h6>
                      {item.href ? <a href={item.href} className="d-inline-block">{item.text}</a> : <p className="mb-0">{item.text}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 position-relative contact-form-con padding-top padding-bottom bg-sky br-30">
          <div className="main-container">
            <div className="heading-title-con text-center">
              <span className="special-text d-inline-block">Get in Touch</span>
              <h2>Send us a Message</h2>
              <p className="contact-form-desc">Have a question or need assistance? Fill out the form below and our team will get back to you within 24 hours.</p>
            </div>
            <div className="contact-form-wrapper">
              {success && <div className="contact-alert contact-alert-success"><i className="fa-regular fa-circle-check" />{success}</div>}
              {error && <div className="contact-alert contact-alert-error"><i className="fa-regular fa-circle-exclamation" />{error}</div>}
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label htmlFor="name"><i className="fa-regular fa-user" /> Your Name</label>
                    <input type="text" placeholder="John Doe" name="name" id="name" value={form.name} onChange={handleChange} />
                  </div>
                  <div className="contact-form-group">
                    <label htmlFor="email"><i className="fa-regular fa-envelope" /> Email Address</label>
                    <input type="email" placeholder="john@example.com" name="email" id="email" value={form.email} onChange={handleChange} />
                  </div>
                </div>
                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label htmlFor="phone"><i className="fa-regular fa-phone" /> Phone Number</label>
                    <input type="tel" placeholder="+1 234 567 890" name="phone" id="phone" value={form.phone} onChange={handleChange} />
                  </div>
                  <div className="contact-form-group">
                    <label htmlFor="subject"><i className="fa-regular fa-tag" /> Subject</label>
                    <select name="subject" id="subject" value={form.subject} onChange={handleChange}>
                      <option value="">Select a subject</option>
                      <option value="order">Order Inquiry</option>
                      <option value="prescription">Prescription Question</option>
                      <option value="delivery">Delivery Issue</option>
                      <option value="product">Product Information</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="contact-form-group">
                  <label htmlFor="message"><i className="fa-regular fa-message" /> Your Message</label>
                  <textarea placeholder="Write your message here..." rows={5} name="message" id="message" value={form.message} onChange={handleChange} />
                </div>
                <div className="contact-form-footer">
                  <button type="submit" className="contact-submit-btn" disabled={loading}>
                    <span>{loading ? 'Sending...' : 'Send Message'}</span>
                    <i className="fa-regular fa-paper-plane" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
        <div className="spacer" />
      </div>

      <div className="padding-rl float-left w-100">
        <div className="float-left w-100 contact-map-con position-relative br-50">
          <div className="container-fluid p-0">
            <iframe src={mapUrl} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Google Maps" className="contact-map-iframe" />
          </div>
        </div>
      </div>
      <div className="clearfix" />
      <div className="spacer" />
    </>
  )
}
