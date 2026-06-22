'use client'

import { useState, useEffect } from 'react'
import API from '../../../lib/api'
import { useToast } from '../../../components/Toast'

export default function AdminMessages() {
  const { addToast } = useToast()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => { load() }, [])

  const load = () => {
    setLoading(true)
    API.get('/contact?limit=100')
      .then(({ data }) => setMessages((data.contacts || data.messages || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const toggleRead = async (msg) => {
    try {
      await API.put(`/contact/${msg._id}`, { isRead: !msg.isRead })
      setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, isRead: !m.isRead } : m))
      if (selected?._id === msg._id) setSelected(prev => ({ ...prev, isRead: !prev.isRead }))
    } catch (err) {
      addToast('Failed to update', 'error')
    }
  }

  const toggleStar = async (msg) => {
    try {
      await API.put(`/contact/${msg._id}`, { isStarred: !msg.isStarred })
      setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, isStarred: !m.isStarred } : m))
      if (selected?._id === msg._id) setSelected(prev => ({ ...prev, isStarred: !prev.isStarred }))
    } catch (err) {
      addToast('Failed to update', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return
    try {
      await API.delete(`/contact/${id}`)
      addToast('Message deleted', 'success')
      if (selected?._id === id) setSelected(null)
      load()
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete', 'error')
    }
  }

  const subjectBadge = (s) => {
    const colors = { order: '#dbeafe', prescription: '#fef3c7', delivery: '#d1fae5', product: '#e0e7ff', other: '#f3f4f6' }
    const textColors = { order: '#1d4ed8', prescription: '#92400e', delivery: '#065f46', product: '#3730a3', other: '#374151' }
    return (
      <span className="status-badge" style={{ background: colors[s] || '#f3f4f6', color: textColors[s] || '#374151' }}>
        {s || 'general'}
      </span>
    )
  }

  return (
    <>
      <div className="admin-page-header">
        <h1><i className="fa-solid fa-envelope" /> Contact Messages</h1>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="admin-loader" /><p>Loading messages...</p></div>
      ) : messages.length === 0 ? (
        <div className="admin-empty"><i className="fa-solid fa-inbox" style={{ fontSize: 32, opacity: 0.5 }} /><p>No messages yet</p></div>
      ) : (
        <div className="admin-table-card">
          <div className="admin-table-header">
            <h2><i className="fa-solid fa-list" /> All Messages ({messages.length})</h2>
            <div style={{ display: 'flex', gap: 4 }}>
              <span className="status-badge status-pending">{messages.filter(m => !m.isRead).length} Unread</span>
              <span className="status-badge status-confirmed">{messages.filter(m => m.isStarred).length} Starred</span>
            </div>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 30 }}></th>
                  <th style={{ width: 30 }}></th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th style={{ width: 100 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map(msg => (
                  <tr key={msg._id} onClick={() => setSelected(msg)} style={{ cursor: 'pointer', background: selected?._id === msg._id ? '#f8fafc' : undefined, fontWeight: msg.isRead ? 400 : 600 }}>
                    <td onClick={e => { e.stopPropagation(); toggleStar(msg) }} style={{ textAlign: 'center' }}>
                      <i className={`fa-solid ${msg.isStarred ? 'fa-star' : 'fa-star-o'}`} style={{ color: msg.isStarred ? '#f59e0b' : '#d1d5db', fontSize: 14 }} />
                    </td>
                    <td onClick={e => e.stopPropagation()} style={{ textAlign: 'center' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: msg.isRead ? 'transparent' : '#6366f1', display: 'inline-block' }} />
                    </td>
                    <td style={{ fontWeight: msg.isRead ? 400 : 600 }}>{msg.name}</td>
                    <td style={{ color: '#64748b', fontSize: 13 }}>{msg.email}</td>
                    <td>{subjectBadge(msg.subject)}</td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#64748b' }}>{msg.message}</td>
                    <td style={{ fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>{new Date(msg.createdAt).toLocaleDateString()} {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => toggleRead(msg)} className="admin-btn admin-btn-sm admin-btn-outline" title={msg.isRead ? 'Mark unread' : 'Mark read'}>
                          <i className={`fa-solid ${msg.isRead ? 'fa-envelope-open' : 'fa-envelope'}`} />
                        </button>
                        <button onClick={() => handleDelete(msg._id)} className="admin-btn admin-btn-sm admin-btn-outline" style={{ color: '#ef4444', borderColor: '#fecaca' }}>
                          <i className="fa-solid fa-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <div className="admin-modal-overlay" onClick={() => setSelected(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 650 }}>
            <div className="admin-modal-header">
              <h2><i className="fa-solid fa-envelope" /> Message from {selected.name}</h2>
              <button onClick={() => setSelected(null)} className="admin-modal-close"><i className="fa-solid fa-xmark" /></button>
            </div>
            <div className="admin-form-grid" style={{ marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Name</p>
                <p style={{ fontWeight: 600 }}>{selected.name}</p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Email</p>
                <p><a href={`mailto:${selected.email}`} style={{ color: '#6366f1' }}>{selected.email}</a></p>
              </div>
              {selected.phone && (
                <div>
                  <p style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Phone</p>
                  <p>{selected.phone}</p>
                </div>
              )}
              <div>
                <p style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Subject</p>
                <p>{subjectBadge(selected.subject)}</p>
              </div>
              <div className="admin-form-full">
                <p style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Message</p>
                <p style={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{selected.message}</p>
              </div>
              <div className="admin-form-full">
                <p style={{ fontSize: 12, color: '#94a3b8' }}>Received: {new Date(selected.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="admin-form-actions" style={{ borderTop: '1px solid #e2e8f0' }}>
              <button onClick={() => toggleRead(selected)} className="admin-btn admin-btn-outline">
                <i className={`fa-solid ${selected.isRead ? 'fa-envelope' : 'fa-envelope-open'}`} /> {selected.isRead ? 'Mark Unread' : 'Mark Read'}
              </button>
              <button onClick={() => toggleStar(selected)} className="admin-btn admin-btn-outline">
                <i className={`fa-solid ${selected.isStarred ? 'fa-star' : 'fa-star-o'}`} style={{ color: selected.isStarred ? '#f59e0b' : undefined }} /> {selected.isStarred ? 'Unstar' : 'Star'}
              </button>
              <button onClick={() => { handleDelete(selected._id); setSelected(null) }} className="admin-btn admin-btn-danger" style={{ marginLeft: 'auto' }}>
                <i className="fa-solid fa-trash" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
