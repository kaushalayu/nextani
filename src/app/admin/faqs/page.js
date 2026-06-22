'use client'

import { useState, useEffect } from 'react'
import API from '../../../lib/api'
import { useToast } from '../../../components/Toast'

export default function AdminFaqs() {
  const { addToast } = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ question: '', answer: '', order: 0, isActive: true })

  useEffect(() => { load() }, [])

  const load = () => {
    setLoading(true)
    API.get('/faqs?limit=100')
      .then(({ data }) => setItems(data.faqs || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const openModal = (item) => {
    if (item) {
      setForm({ question: item.question || '', answer: item.answer || '', order: item.order || 0, isActive: item.isActive !== false })
    } else {
      setForm({ question: '', answer: '', order: 0, isActive: true })
    }
    setModal(item?._id || 'new')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.question.trim()) return addToast('Question is required', 'error')
    if (!form.answer.trim()) return addToast('Answer is required', 'error')
    setSaving(true)
    try {
      const payload = { ...form, order: Number(form.order) }

      if (modal === 'new') {
        await API.post('/faqs', payload)
        addToast('FAQ created', 'success')
      } else {
        await API.put(`/faqs/${modal}`, payload)
        addToast('FAQ updated', 'success')
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
    if (!confirm('Delete this FAQ?')) return
    try {
      await API.delete(`/faqs/${id}`)
      addToast('FAQ deleted', 'success')
      load()
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete', 'error')
    }
  }

  return (
    <>
      <div className="admin-page-header">
        <h1><i className="fa-solid fa-question" /> FAQs</h1>
        <button onClick={() => openModal(null)} className="admin-btn admin-btn-primary">
          <i className="fa-solid fa-plus" /> Add FAQ
        </button>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="admin-loader" /><p>Loading...</p></div>
      ) : (
        <div className="admin-table-card">
          <div className="admin-table-header">
            <h2><i className="fa-solid fa-list" /> All FAQs ({items.length})</h2>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Order</th>
                  <th>Question</th>
                  <th>Answer</th>
                  <th>Status</th>
                  <th style={{ width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...items].sort((a, b) => (a.order || 0) - (b.order || 0)).map(f => (
                  <tr key={f._id}>
                    <td style={{ textAlign: 'center', color: '#94a3b8' }}>{f.order || 0}</td>
                    <td style={{ fontWeight: 600 }}>{f.question}</td>
                    <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#64748b' }}>{f.answer}</td>
                    <td><span className={`status-badge ${f.isActive ? 'status-delivered' : 'status-cancelled'}`}>{f.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => openModal(f)} className="admin-btn admin-btn-sm admin-btn-outline"><i className="fa-solid fa-pen" /></button>
                        <button onClick={() => handleDelete(f._id)} className="admin-btn admin-btn-sm admin-btn-outline" style={{ color: '#ef4444', borderColor: '#fecaca' }}><i className="fa-solid fa-trash" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: '#94a3b8' }}>No FAQs found</td></tr>
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
              <h2><i className="fa-solid fa-question" /> {modal === 'new' ? 'Add FAQ' : 'Edit FAQ'}</h2>
              <button onClick={() => setModal(null)} className="admin-modal-close"><i className="fa-solid fa-xmark" /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-form-grid">
                <div className="admin-form-full">
                  <div className="admin-form-group">
                    <label>Question *</label>
                    <input value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} required placeholder="Frequently asked question" />
                  </div>
                </div>
                <div className="admin-form-full">
                  <div className="admin-form-group">
                    <label>Answer *</label>
                    <textarea value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} rows={4} required placeholder="Detailed answer" />
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
