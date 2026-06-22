'use client'

import { useState, useEffect } from 'react'
import API from '../../../lib/api'
import { useToast } from '../../../components/Toast'

export default function AdminUsers() {
  const { addToast } = useToast()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', role: 'user', phone: '', isActive: true })

  useEffect(() => { load() }, [])

  const load = () => {
    setLoading(true)
    API.get('/admin/users?limit=200')
      .then(({ data }) => setUsers(data.users || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const openModal = (user) => {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '', role: user.role || 'user', phone: user.phone || '', isActive: user.isActive !== false })
    } else {
      setForm({ name: '', email: '', role: 'user', phone: '', isActive: true })
    }
    setModal(user?._id || 'new')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return addToast('Name is required', 'error')
    if (!form.email.trim()) return addToast('Email is required', 'error')
    setSaving(true)
    try {
      const payload = { name: form.name, email: form.email, role: form.role, phone: form.phone, isActive: form.isActive }

      if (modal === 'new') {
        await API.post('/auth/register', { ...payload, password: 'password123' })
        addToast('User created (default pass: password123)', 'success')
      } else {
        await API.put(`/admin/users/${modal}`, payload)
        addToast('User updated', 'success')
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
    if (!confirm('Delete this user?')) return
    try {
      await API.delete(`/admin/users/${id}`)
      addToast('User deleted', 'success')
      load()
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete', 'error')
    }
  }

  return (
    <>
      <div className="admin-page-header">
        <h1><i className="fa-solid fa-users" /> Users</h1>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="admin-loader" /><p>Loading...</p></div>
      ) : (
        <div className="admin-table-card">
          <div className="admin-table-header">
            <h2><i className="fa-solid fa-list" /> All Users ({users.length})</h2>
            <span className="status-badge status-confirmed">{users.filter(u => u.role === 'admin').length} Admins</span>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th style={{ width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td style={{ color: '#64748b', fontSize: 13 }}>{u.email}</td>
                    <td style={{ fontSize: 13, color: '#64748b' }}>{u.phone || '-'}</td>
                    <td>
                      <span className={`status-badge ${u.role === 'admin' ? 'status-confirmed' : 'status-pending'}`}>
                        {u.role === 'admin' ? <><i className="fa-solid fa-shield" style={{ marginRight: 4 }} /> Admin</> : 'User'}
                      </span>
                    </td>
                    <td><span className={`status-badge ${u.isActive ? 'status-delivered' : 'status-cancelled'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td style={{ fontSize: 12, color: '#94a3b8' }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => openModal(u)} className="admin-btn admin-btn-sm admin-btn-outline"><i className="fa-solid fa-pen" /></button>
                        <button onClick={() => handleDelete(u._id)} className="admin-btn admin-btn-sm admin-btn-outline" style={{ color: '#ef4444', borderColor: '#fecaca' }}><i className="fa-solid fa-trash" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: '#94a3b8' }}>No users found</td></tr>
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
              <h2><i className="fa-solid fa-user" /> {modal === 'new' ? 'Add User' : 'Edit User'}</h2>
              <button onClick={() => setModal(null)} className="admin-modal-close"><i className="fa-solid fa-xmark" /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Full name" />
                </div>
                <div className="admin-form-group">
                  <label>Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="email@example.com" />
                </div>
                <div className="admin-form-group">
                  <label>Phone</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="Phone number" />
                </div>
                <div className="admin-form-group">
                  <label>Role</label>
                  <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
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
