'use client'

import { useState, useEffect } from 'react'
import API from '../../../lib/api'
import { useToast } from '../../../components/Toast'

const defaultPages = [
  { page: '/', label: 'Home' },
  { page: '/about', label: 'About Us' },
  { page: '/shop', label: 'Shop / Products' },
  { page: '/cart', label: 'Cart' },
  { page: '/wishlist', label: 'Wishlist' },
  { page: '/checkout', label: 'Checkout' },
  { page: '/contact', label: 'Contact Us' },
  { page: '/faq', label: 'FAQs' },
  { page: '/services', label: 'Services' },
  { page: '/testimonials', label: 'Testimonials' },
  { page: '/terms-of-use', label: 'Terms & Conditions' },
  { page: '/privacy-policy', label: 'Privacy Policy' },
  { page: '/blog', label: 'Blog' },
  { page: '/login', label: 'Login' },
  { page: '/join', label: 'Join / Register' },
  { page: '/my-orders', label: 'My Orders' },
  { page: '/profile', label: 'Profile' },
  { page: '/thank-you', label: 'Thank You' },
  { page: '/coming-soon', label: 'Coming Soon' },
]

const emptyMeta = { title: '', description: '', keywords: '', ogImage: '' }

export default function AdminPageMeta() {
  const { addToast } = useToast()
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(null)
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    API.get('/admin/page-meta').then(({ data }) => {
      const saved = data.data || []
      const merged = defaultPages.map(dp => {
        const found = saved.find(s => s.page === dp.page)
        return { ...dp, ...emptyMeta, ...(found ? { _id: found._id, title: found.title || '', description: found.description || '', keywords: found.keywords || '', ogImage: found.ogImage || '' } : {}) }
      })
      setPages(merged)
    }).catch(() => {
      setPages(defaultPages.map(dp => ({ ...dp, ...emptyMeta })))
    }).finally(() => setLoading(false))
  }, [])

  const handleChange = (page, field, value) => {
    setPages(prev => prev.map(p => p.page === page ? { ...p, [field]: value } : p))
  }

  const handleSave = async (page) => {
    setSaving(page)
    try {
      const p = pages.find(x => x.page === page)
      await API.put('/admin/page-meta', {
        page: p.page,
        title: p.title,
        description: p.description,
        keywords: p.keywords,
        ogImage: p.ogImage,
      })
      addToast(`"${p.label}" meta saved`, 'success')
      setEditing(null)
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save', 'error')
    } finally {
      setSaving(null)
    }
  }

  if (loading) return <div className="admin-loading"><div className="admin-loader" /><p>Loading page meta...</p></div>

  return (
    <>
      <div className="admin-page-header">
        <h1><i className="fa-solid fa-file-pen" /> Page Meta Tags</h1>
        <p style={{ color: '#64748b', margin: 0 }}>Set custom title &amp; description for each page (overrides defaults)</p>
      </div>

      {pages.map(p => (
        <div key={p.page} className="admin-form-card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 className="admin-section-title" style={{ margin: 0 }}>
              <i className="fa-solid fa-link" style={{ fontSize: 14, color: '#94a3b8', marginRight: 8 }} />
              {p.label}
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 400, marginLeft: 8 }}>{p.page}</span>
            </h3>
            <button
              onClick={() => editing === p.page ? setEditing(null) : setEditing(p.page)}
              className="admin-btn"
              style={{ background: 'none', border: '1px solid #cbd5e1', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}
            >
              <i className={`fa-solid ${editing === p.page ? 'fa-chevron-up' : 'fa-pen-to-square'}`} style={{ marginRight: 6 }} />
              {editing === p.page ? 'Collapse' : 'Edit'}
            </button>
          </div>

          {!p.title && !p.description && editing !== p.page && (
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, fontStyle: 'italic' }}>Using default meta — click Edit to customize</p>
          )}

          {editing === p.page && (
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label>Meta Title</label>
                <input value={p.title} onChange={e => handleChange(p.page, 'title', e.target.value)} placeholder={`Title for ${p.label}`} />
              </div>
              <div className="admin-form-group">
                <label>Meta Keywords</label>
                <input value={p.keywords} onChange={e => handleChange(p.page, 'keywords', e.target.value)} placeholder="keyword1, keyword2, ..." />
              </div>
              <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Meta Description</label>
                <textarea value={p.description} onChange={e => handleChange(p.page, 'description', e.target.value)} rows={2} placeholder={`Description for ${p.label}`} />
              </div>
              <div className="admin-form-actions" style={{ gridColumn: '1 / -1', padding: 0, marginTop: 8 }}>
                <button onClick={() => handleSave(p.page)} className="admin-btn admin-btn-primary" disabled={saving === p.page} style={{ fontSize: 13 }}>
                  {saving === p.page ? <><i className="fa-solid fa-spinner fa-spin" /> Saving...</> : <><i className="fa-solid fa-floppy-disk" /> Save "{p.label}"</>}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  )
}
