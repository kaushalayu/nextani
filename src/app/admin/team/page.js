'use client'

import { useState, useEffect } from 'react'
import API from '../../../lib/api'
import { useToast } from '../../../components/Toast'

export default function AdminTeam() {
  const { addToast } = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', role: '', bio: '', order: 0, isActive: true, socialLinks: { facebook: '', instagram: '', linkedin: '', twitter: '' } })
  const [imageFile, setImageFile] = useState(null)

  useEffect(() => { load() }, [])

  const load = () => {
    setLoading(true)
    API.get('/team?limit=100')
      .then(({ data }) => setItems(data.team || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const openModal = (item) => {
    if (item) {
      setForm({
        name: item.name || '', role: item.role || '', bio: item.bio || '', order: item.order || 0, isActive: item.isActive !== false,
        socialLinks: { facebook: item.socialLinks?.facebook || '', instagram: item.socialLinks?.instagram || '', linkedin: item.socialLinks?.linkedin || '', twitter: item.socialLinks?.twitter || '' },
      })
    } else {
      setForm({ name: '', role: '', bio: '', order: 0, isActive: true, socialLinks: { facebook: '', instagram: '', linkedin: '', twitter: '' } })
    }
    setImageFile(null)
    setModal(item?._id || 'new')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return addToast('Name is required', 'error')
    if (!form.role.trim()) return addToast('Role is required', 'error')
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('role', form.role)
      fd.append('bio', form.bio)
      fd.append('order', Number(form.order))
      fd.append('isActive', form.isActive)
      fd.append('socialLinks', JSON.stringify(form.socialLinks))
      if (imageFile) fd.append('image', imageFile)

      if (modal === 'new') {
        await API.post('/team', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        addToast('Team member added', 'success')
      } else {
        await API.put(`/team/${modal}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        addToast('Team member updated', 'success')
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
    if (!confirm('Remove this team member?')) return
    try {
      await API.delete(`/team/${id}`)
      addToast('Team member removed', 'success')
      load()
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete', 'error')
    }
  }

  return (
    <>
      <div className="admin-page-header">
        <h1><i className="fa-solid fa-user-tie" /> Team</h1>
        <button onClick={() => openModal(null)} className="admin-btn admin-btn-primary">
          <i className="fa-solid fa-plus" /> Add Member
        </button>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="admin-loader" /><p>Loading...</p></div>
      ) : (
        <div className="admin-table-card">
          <div className="admin-table-header">
            <h2><i className="fa-solid fa-list" /> Team Members ({items.length})</h2>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Bio</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th style={{ width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...items].sort((a, b) => (a.order || 0) - (b.order || 0)).map(m => (
                  <tr key={m._id}>
                    <td>
                      {m.image ? (
                        <img loading="lazy" src={m.image.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL}${m.image}` : m.image} alt={m.name} className="admin-product-img" style={{ borderRadius: '50%' }} />
                      ) : (
                        <div className="admin-product-img" style={{ borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', background: '#f1f5f9' }}>
                          <i className="fa-solid fa-user" />
                        </div>
                      )}
                    </td>
                    <td style={{ fontWeight: 600 }}>{m.name}</td>
                    <td style={{ fontSize: 13, color: '#64748b' }}>{m.role}</td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#64748b' }}>{m.bio || '-'}</td>
                    <td style={{ textAlign: 'center', color: '#94a3b8' }}>{m.order || 0}</td>
                    <td><span className={`status-badge ${m.isActive ? 'status-delivered' : 'status-cancelled'}`}>{m.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => openModal(m)} className="admin-btn admin-btn-sm admin-btn-outline"><i className="fa-solid fa-pen" /></button>
                        <button onClick={() => handleDelete(m._id)} className="admin-btn admin-btn-sm admin-btn-outline" style={{ color: '#ef4444', borderColor: '#fecaca' }}><i className="fa-solid fa-trash" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: '#94a3b8' }}>No team members found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 650 }}>
            <div className="admin-modal-header">
              <h2><i className="fa-solid fa-user-tie" /> {modal === 'new' ? 'Add Member' : 'Edit Member'}</h2>
              <button onClick={() => setModal(null)} className="admin-modal-close"><i className="fa-solid fa-xmark" /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Full name" />
                </div>
                <div className="admin-form-group">
                  <label>Role *</label>
                  <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} required placeholder="e.g. Pharmacist" />
                </div>
                <div className="admin-form-group">
                  <label>Display Order</label>
                  <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: e.target.value }))} placeholder="0" />
                </div>
                <div className="admin-form-group">
                  <label>Photo</label>
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
                </div>
                <div className="admin-form-full">
                  <div className="admin-form-group">
                    <label>Bio</label>
                    <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={3} placeholder="Short biography" />
                  </div>
                </div>
                <div className="admin-form-full">
                  <div className="admin-section-title" style={{ fontSize: 13, marginBottom: 8 }}>
                    <i className="fa-solid fa-share-nodes" /> Social Links
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {['facebook', 'instagram', 'linkedin', 'twitter'].map(platform => (
                      <div key={platform} className="admin-form-group">
                        <label style={{ textTransform: 'capitalize' }}>{platform}</label>
                        <input value={form.socialLinks[platform]} onChange={e => setForm(f => ({ ...f, socialLinks: { ...f.socialLinks, [platform]: e.target.value } }))} placeholder={`${platform}.com/...`} />
                      </div>
                    ))}
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
