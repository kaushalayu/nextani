'use client'

import { useState, useEffect } from 'react'
import API from '../lib/api'

export default function LeadPopup() {
  const [visible, setVisible] = useState(false)
  const [form, setForm] = useState({ name: '', mobile: '', email: '' })
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    let shown = false
    try { shown = sessionStorage.getItem('painomed_lead_popup_shown') === '1' } catch (e) {}
    if (shown) return
    const timer = setTimeout(() => {
      try { sessionStorage.setItem('painomed_lead_popup_shown', '1') } catch (e) {}
      setVisible(true)
    }, 6000)
    return () => clearTimeout(timer)
  }, [])

  const close = () => {
    setVisible(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.mobile.trim()) {
      setStatus({ type: 'error', text: 'Please enter your name and mobile number.' })
      return
    }
    setSubmitting(true)
    setStatus(null)
    try {
      await API.post('/leads', { ...form, source: 'popup' })
      setStatus({ type: 'success', text: 'Thank you! Our team will contact you soon.' })
    } catch (err) {
      setStatus({ type: 'error', text: 'Something went wrong. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (!visible) return null

  return (
    <div className="lead-popup-overlay" onClick={close}>
      <div className="lead-popup" onClick={(e) => e.stopPropagation()}>
        <button className="lead-popup-close" onClick={close} aria-label="Close">X</button>
        <div className="lead-popup-icon"><i className="fa-solid fa-tag"></i></div>
        <h3>Get 10% Off Your First Order!</h3>
        <p>Enter your details and get a one-time discount code plus updates on new offers.</p>
        {status ? (
          <p className={`lead-popup-msg lead-popup-msg-${status.type}`}>{status.text}</p>
        ) : (
          <form onSubmit={handleSubmit} className="lead-popup-form">
            <input type="text" placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input type="tel" placeholder="Mobile Number" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} required />
            <input type="email" placeholder="Email (optional)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <button type="submit" disabled={submitting} className="lead-popup-btn">
              {submitting ? 'Submitting...' : 'Get My Discount'}
            </button>
          </form>
        )}
        <button className="lead-popup-skip" onClick={close}>No thanks, I just want to browse</button>
      </div>
    </div>
  )
}
