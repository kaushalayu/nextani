'use client'

import { useState, useEffect } from 'react'
import API from '../../../lib/api'
import { useToast } from '../../../components/Toast'

export default function AdminNewsletter() {
  const { addToast } = useToast()
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  const load = () => {
    setLoading(true)
    API.get('/newsletter?limit=500')
      .then(({ data }) => setSubs(data.subscribers || data.newsletters || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const copyEmails = () => {
    const emails = subs.map(s => s.email).join(', ')
    navigator.clipboard.writeText(emails).then(() => {
      addToast(`${subs.length} emails copied!`, 'success')
    }).catch(() => {
      addToast('Failed to copy', 'error')
    })
  }

  return (
    <>
      <div className="admin-page-header">
        <h1><i className="fa-solid fa-newspaper" /> Newsletter</h1>
        <button onClick={copyEmails} className="admin-btn admin-btn-primary" disabled={subs.length === 0}>
          <i className="fa-solid fa-copy" /> Copy All Emails
        </button>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="admin-loader" /><p>Loading...</p></div>
      ) : (
        <div className="admin-table-card">
          <div className="admin-table-header">
            <h2><i className="fa-solid fa-list" /> Subscribers ({subs.length})</h2>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Subscribed</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {subs.map(s => (
                  <tr key={s._id}>
                    <td style={{ fontWeight: 600 }}>{s.email}</td>
                    <td><span className={`status-badge ${s.isActive !== false ? 'status-delivered' : 'status-cancelled'}`}>{s.isActive !== false ? 'Active' : 'Inactive'}</span></td>
                    <td style={{ fontSize: 12, color: '#94a3b8' }}>{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
                {subs.length === 0 && (
                  <tr><td colSpan={3} style={{ textAlign: 'center', padding: 32, color: '#94a3b8' }}>No subscribers yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}
