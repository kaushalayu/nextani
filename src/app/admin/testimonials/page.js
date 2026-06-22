'use client'

import { useState, useEffect } from 'react'
import API from '../../../lib/api'
import { useToast } from '../../../components/Toast'

export default function AdminTestimonials() {
  const { addToast } = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', role: 'Happy Customer', text: '', rating: 5, isActive: true })
  const [imageFile, setImageFile] = useState(null)

  useEffect(() => { load() }, [])

  const load = () => {
    setLoading(true)
    API.get('/testimonials?limit=100')
      .then(({ data }) => setItems(data.testimonials || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const openModal = (item) => {
    if (item) {
      setForm({ name: item.name || '', role: item.role || 'Happy Customer', text: item.text || '', rating: item.rating || 5, isActive: item.isActive !== false })
    } else {
      setForm({ name: '', role: 'Happy Customer', text: '', rating: 5, isActive: true })
    }
    setImageFile(null)
    setModal(item?._id || 'new')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return addToast('Name is required', 'error')
    if (!form.text.trim()) return addToast('Text is required', 'error')
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('role', form.role)
      fd.append('text', form.text)
      fd.append('rating', form.rating)
      fd.append('isActive', form.isActive)
      if (imageFile) fd.append('image', imageFile)

      if (modal === 'new') {
        await API.post('/testimonials', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        addToast('Testimonial created', 'success')
      } else {
        await API.put(`/testimonials/${modal}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        addToast('Testimonial updated', 'success')
      }
      setModal(null)
      load()
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this testimonial?')) return
    try {
      await API.delete(`/testimonials/${id}`)
      addToast('Testimonial deleted', 'success')
      load()
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete', 'error')
    }
  }

  const renderStars = (n) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(<i key={i} className={`fa-solid fa-star${i <= n ? '' : '-o'}`} style={{ color: i <= n ? '#f59e0b' : '#d1d5db', fontSize: 13 }} />)
    }
    return stars
  }

  return (
    <>
      <div className="admin-page-header">
        <h1><i className="fa-solid fa-star" /> Testimonials</h1>
        <button onClick={() => openModal(null)} className="admin-btn admin-btn-primary">
          <i className="fa-solid fa-plus" /> Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="admin-loader" /><p>Loading...</p></div>
      ) : (
        <div className="admin-table-card">
          <div className="admin-table-header">
            <h2><i className="fa-solid fa-list" /> All Testimonials ({items.length})</h2>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Rating</th>
                  <th>Text</th>
                  <th>Status</th>
                  <th style={{ width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(t => (
                  <tr key={t._id}>
                    <td>
                      {t.image ? (
                        <img loading="lazy" src={t.image.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL}${t.image}` : t.image} alt={t.name} className="admin-product-img" style={{ borderRadius: '50%' }} />
                      ) : (
                        <div className="admin-product-img" style={{ borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', background: '#f1f5f9' }}>
                          <i className="fa-solid fa-user" />
                        </div>
                      )}
                    </td>
                    <td style={{ fontWeight: 600 }}>{t.name}</td>
                    <td style={{ fontSize: 13, color: '#64748b' }}>{t.role || 'Happy Customer'}</td>
                    <td><div style={{ display: 'flex', gap: 1 }}>{renderStars(t.rating || 5)}</div></td>
                    <td style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#64748b' }}>{t.text}</td>
                    <td><span className={`status-badge ${t.isActive ? 'status-delivered' : 'status-cancelled'}`}>{t.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => openModal(t)} className="admin-btn admin-btn-sm admin-btn-outline"><i className="fa-solid fa-pen" /></button>
                        <button onClick={() => handleDelete(t._id)} className="admin-btn admin-btn-sm admin-btn-outline" style={{ color: '#ef4444', borderColor: '#fecaca' }}><i className="fa-solid fa-trash" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: '#94a3b8' }}>No testimonials found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <div className="admin-modal-header">
              <h2><i className="fa-solid fa-star" /> {modal === 'new' ? 'Add Testimonial' : 'Edit Testimonial'}</h2>
              <button onClick={() => setModal(null)} className="admin-modal-close"><i className="fa-solid fa-xmark" /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Customer name" />
                </div>
                <div className="admin-form-group">
                  <label>Role</label>
                  <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="e.g. Happy Customer" />
                </div>
                <div className="admin-form-group">
                  <label>Rating</label>
                  <select value={form.rating} onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))}>
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Image</label>
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
                </div>
                <div className="admin-form-full">
                  <div className="admin-form-group">
                    <label>Text *</label>
                    <textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} rows={3} required placeholder="What they said..." />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label style={{ marginBottom: 4 }}>Status</label>
                  <label className="admin-flag-label" style={{ width: 'fit-content' }}>
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                    Active
                  </label>
                </div>
              </div>
              <div className="admin-form-actions">
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  {saving ? <><i className="fa-solid fa-spinner fa-spin" /> Saving...</> : <><i className="fa-solid fa-floppy-disk" /> Save</>}
                </button>
                <button type="button" onClick={() => setModal(null)} className="admin-btn admin-btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
