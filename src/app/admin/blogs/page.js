'use client'

import { useState, useEffect } from 'react'
import API from '../../../lib/api'
import { useToast } from '../../../components/Toast'

export default function AdminBlogs() {
  const { addToast } = useToast()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', category: 'All', author: 'Admin', isPublished: true, metaTitle: '', metaDescription: '' })
  const [imageFile, setImageFile] = useState(null)

  useEffect(() => { load() }, [])

  const load = () => {
    setLoading(true)
    API.get('/blogs?limit=100')
      .then(({ data }) => setBlogs(data.blogs || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const openModal = (blog) => {
    if (blog) {
      setForm({ title: blog.title || '', content: blog.content || '', excerpt: blog.excerpt || '', category: blog.category || 'All', author: blog.author || 'Admin', isPublished: blog.isPublished !== false, metaTitle: blog.metaTitle || '', metaDescription: blog.metaDescription || '' })
    } else {
      setForm({ title: '', content: '', excerpt: '', category: 'All', author: 'Admin', isPublished: true, metaTitle: '', metaDescription: '' })
    }
    setImageFile(null)
    setModal(blog?._id || 'new')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return addToast('Title is required', 'error')
    if (!form.content.trim()) return addToast('Content is required', 'error')
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('content', form.content)
      fd.append('excerpt', form.excerpt)
      fd.append('category', form.category)
      fd.append('author', form.author)
      fd.append('isPublished', form.isPublished)
      fd.append('metaTitle', form.metaTitle)
      fd.append('metaDescription', form.metaDescription)
      if (imageFile) fd.append('image', imageFile)

      if (modal === 'new') {
        await API.post('/blogs', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        addToast('Blog created', 'success')
      } else {
        await API.put(`/blogs/${modal}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        addToast('Blog updated', 'success')
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
    if (!confirm('Delete this blog?')) return
    try {
      await API.delete(`/blogs/${id}`)
      addToast('Blog deleted', 'success')
      load()
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete', 'error')
    }
  }

  const categories = ['All', 'Advices', 'Announcements', 'News', 'Consultation', 'Development']

  return (
    <>
      <div className="admin-page-header">
        <h1><i className="fa-solid fa-blog" /> Blogs</h1>
        <button onClick={() => openModal(null)} className="admin-btn admin-btn-primary">
          <i className="fa-solid fa-plus" /> New Blog
        </button>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="admin-loader" /><p>Loading...</p></div>
      ) : (
        <div className="admin-table-card">
          <div className="admin-table-header">
            <h2><i className="fa-solid fa-list" /> All Blogs ({blogs.length})</h2>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map(b => (
                  <tr key={b._id}>
                    <td>
                      {b.image ? (
                        <img loading="lazy" src={b.image.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL}${b.image}` : b.image} alt={b.title} className="admin-product-img" />
                      ) : (
                        <div className="admin-product-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                          <i className="fa-solid fa-file-lines" />
                        </div>
                      )}
                    </td>
                    <td style={{ fontWeight: 600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</td>
                    <td><span className="status-badge status-confirmed">{b.category || 'All'}</span></td>
                    <td>{b.author || 'Admin'}</td>
                    <td><span className={`status-badge ${b.isPublished ? 'status-delivered' : 'status-cancelled'}`}>{b.isPublished ? 'Published' : 'Draft'}</span></td>
                    <td style={{ fontSize: 13, color: '#64748b' }}>{b.createdAt ? new Date(b.createdAt).toLocaleDateString() : '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => openModal(b)} className="admin-btn admin-btn-sm admin-btn-outline"><i className="fa-solid fa-pen" /></button>
                        <button onClick={() => handleDelete(b._id)} className="admin-btn admin-btn-sm admin-btn-outline" style={{ color: '#ef4444', borderColor: '#fecaca' }}><i className="fa-solid fa-trash" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {blogs.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: '#94a3b8' }}>No blogs found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 700 }}>
            <div className="admin-modal-header">
              <h2><i className="fa-solid fa-blog" /> {modal === 'new' ? 'New Blog' : 'Edit Blog'}</h2>
              <button onClick={() => setModal(null)} className="admin-modal-close"><i className="fa-solid fa-xmark" /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="admin-form-grid">
                <div className="admin-form-full">
                  <div className="admin-form-group">
                    <label>Title *</label>
                    <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="Blog title" />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Author</label>
                  <input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} placeholder="Author name" />
                </div>
                <div className="admin-form-full">
                  <div className="admin-form-group">
                    <label>Excerpt</label>
                    <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={2} placeholder="Short summary (max 300 chars)" />
                  </div>
                </div>
                <div className="admin-form-full">
                  <div className="admin-form-group">
                    <label>Meta Title (SEO)</label>
                    <input value={form.metaTitle} onChange={e => setForm(f => ({ ...f, metaTitle: e.target.value }))} placeholder="SEO title (leave empty to use blog title)" />
                  </div>
                </div>
                <div className="admin-form-full">
                  <div className="admin-form-group">
                    <label>Meta Description (SEO)</label>
                    <textarea value={form.metaDescription} onChange={e => setForm(f => ({ ...f, metaDescription: e.target.value }))} rows={2} placeholder="SEO meta description (leave empty to use excerpt)" />
                  </div>
                </div>
                <div className="admin-form-full">
                  <div className="admin-form-group">
                    <label>Content *</label>
                    <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={8} required placeholder="Blog content..." style={{ minHeight: 200 }} />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Image</label>
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
                </div>
                <div className="admin-form-group">
                  <label style={{ marginBottom: 4 }}>Status</label>
                  <label className="admin-flag-label" style={{ width: 'fit-content' }}>
                    <input type="checkbox" checked={form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} />
                    Published
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
