'use client'

import { useState, useEffect } from 'react'
import API from '../../../lib/api'
import { useToast } from '../../../components/Toast'

export default function AdminServices() {
  const { addToast } = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', icon: 'fa-solid fa-star', order: 0, isActive: true })

  useEffect(() => { load() }, [])

  const load = () => {
    setLoading(true)
    API.get('/services?limit=100')
      .then(({ data }) => setItems(data.services || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const openModal = (item) => {
    if (item) {
      setForm({ title: item.title || '', description: item.description || '', icon: item.icon || 'fa-solid fa-star', order: item.order || 0, isActive: item.isActive !== false })
    } else {
      setForm({ title: '', description: '', icon: 'fa-solid fa-star', order: 0, isActive: true })
    }
    setModal(item?._id || 'new')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return addToast('Title is required', 'error')
    if (!form.description.trim()) return addToast('Description is required', 'error')
    setSaving(true)
    try {
      const payload = { ...form, order: Number(form.order) }

      if (modal === 'new') {
        await API.post('/services', payload)
        addToast('Service created', 'success')
      } else {
        await API.put(`/services/${modal}`, payload)
        addToast('Service updated', 'success')
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
    if (!confirm('Delete this service?')) return
    try {
      await API.delete(`/services/${id}`)
      addToast('Service deleted', 'success')
      load()
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete', 'error')
    }
  }

  const iconOptions = [
    'fa-solid fa-star', 'fa-solid fa-truck', 'fa-solid fa-shield', 'fa-solid fa-headset',
    'fa-solid fa-flask', 'fa-solid fa-heart-pulse', 'fa-solid fa-prescription-bottle',
    'fa-solid fa-hand-holding-heart', 'fa-solid fa-clock', 'fa-solid fa-tag',
    'fa-solid fa-box', 'fa-solid fa-credit-card', 'fa-solid fa-globe',
  ]

  return (
    <>
      <div className="admin-page-header">
        <h1><i className="fa-solid fa-hand-holding-heart" /> Services</h1>
        <button onClick={() => openModal(null)} className="admin-btn admin-btn-primary">
          <i className="fa-solid fa-plus" /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="admin-loader" /><p>Loading...</p></div>
      ) : (
        <div className="admin-table-card">
          <div className="admin-table-header">
            <h2><i className="fa-solid fa-list" /> All Services ({items.length})</h2>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Icon</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th style={{ width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...items].sort((a, b) => (a.order || 0) - (b.order || 0)).map(s => (
                  <tr key={s._id}>
                    <td style={{ textAlign: 'center', fontSize: 18, color: '#6366f1' }}>
                      <i className={s.icon || 'fa-solid fa-star'} />
                    </td>
                    <td style={{ fontWeight: 600 }}>{s.title}</td>
                    <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#64748b' }}>{s.description}</td>
                    <td style={{ textAlign: 'center', color: '#94a3b8' }}>{s.order || 0}</td>
                    <td><span className={`status-badge ${s.isActive ? 'status-delivered' : 'status-cancelled'}`}>{s.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => openModal(s)} className="admin-btn admin-btn-sm admin-btn-outline"><i className="fa-solid fa-pen" /></button>
                        <button onClick={() => handleDelete(s._id)} className="admin-btn admin-btn-sm admin-btn-outline" style={{ color: '#ef4444', borderColor: '#fecaca' }}><i className="fa-solid fa-trash" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: '#94a3b8' }}>No services found</td></tr>
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
              <h2><i className="fa-solid fa-hand-holding-heart" /> {modal === 'new' ? 'Add Service' : 'Edit Service'}</h2>
              <button onClick={() => setModal(null)} className="admin-modal-close"><i className="fa-solid fa-xmark" /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-form-grid">
                <div className="admin-form-full">
                  <div className="admin-form-group">
                    <label>Title *</label>
                    <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="Service name" />
                  </div>
                </div>
                <div className="admin-form-full">
                  <div className="admin-form-group">
                    <label>Description *</label>
                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} required placeholder="What this service offers" />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Icon</label>
                  <select value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}>
                    {iconOptions.map(ico => (
                      <option key={ico} value={ico}>{ico.replace('fa-solid fa-', '')}</option>
                    ))}
                  </select>
                  <div style={{ marginTop: 6, fontSize: 22, color: '#6366f1' }}>
                    <i className={form.icon} /> Preview
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Display Order</label>
                  <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: e.target.value }))} placeholder="0" />
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
