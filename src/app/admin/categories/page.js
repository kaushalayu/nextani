'use client'

import { useState, useEffect } from 'react'
import API from '../../../lib/api'
import { useToast } from '../../../components/Toast'

export default function AdminCategories() {
  const { addToast } = useToast()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', isActive: true })
  const [imageFile, setImageFile] = useState(null)

  useEffect(() => { load() }, [])

  const load = () => {
    setLoading(true)
    API.get('/categories?limit=100')
      .then(({ data }) => setCategories(data.categories || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const openModal = (cat) => {
    if (cat) {
      setForm({ name: cat.name || '', description: cat.description || '', isActive: cat.isActive !== false })
    } else {
      setForm({ name: '', description: '', isActive: true })
    }
    setImageFile(null)
    setModal(cat?._id || 'new')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return addToast('Name is required', 'error')
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('description', form.description)
      fd.append('isActive', form.isActive)
      if (imageFile) fd.append('image', imageFile)

      if (modal === 'new') {
        await API.post('/categories', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        addToast('Category created', 'success')
      } else {
        await API.put(`/categories/${modal}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        addToast('Category updated', 'success')
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
    if (!confirm('Delete this category?')) return
    try {
      await API.delete(`/categories/${id}`)
      addToast('Category deleted', 'success')
      load()
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete', 'error')
    }
  }

  return (
    <>
      <div className="admin-page-header">
        <h1><i className="fa-solid fa-tags" /> Categories</h1>
        <button onClick={() => openModal(null)} className="admin-btn admin-btn-primary">
          <i className="fa-solid fa-plus" /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="admin-loader" /><p>Loading...</p></div>
      ) : (
        <div className="admin-table-card">
          <div className="admin-table-header">
            <h2><i className="fa-solid fa-list" /> All Categories ({categories.length})</h2>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th style={{ width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(c => (
                  <tr key={c._id}>
                    <td>
                      {c.image ? (
                        <img loading="lazy" src={c.image.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL}${c.image}` : c.image} alt={c.name} className="admin-product-img" />
                      ) : (
                        <div className="admin-product-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                          <i className="fa-solid fa-tag" />
                        </div>
                      )}
                    </td>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td style={{ color: '#64748b', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.description || '-'}</td>
                    <td><span className={`status-badge ${c.isActive ? 'status-delivered' : 'status-cancelled'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => openModal(c)} className="admin-btn admin-btn-sm admin-btn-outline"><i className="fa-solid fa-pen" /></button>
                        <button onClick={() => handleDelete(c._id)} className="admin-btn admin-btn-sm admin-btn-outline" style={{ color: '#ef4444', borderColor: '#fecaca' }}><i className="fa-solid fa-trash" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: '#94a3b8' }}>No categories found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="admin-modal-header">
              <h2><i className="fa-solid fa-tag" /> {modal === 'new' ? 'Add Category' : 'Edit Category'}</h2>
              <button onClick={() => setModal(null)} className="admin-modal-close"><i className="fa-solid fa-xmark" /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-form-grid">
                <div className="admin-form-full">
                  <div className="admin-form-group">
                    <label>Name *</label>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Category name" />
                  </div>
                </div>
                <div className="admin-form-full">
                  <div className="admin-form-group">
                    <label>Description</label>
                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Short description" />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Image</label>
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
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
