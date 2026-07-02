'use client'

import { useState, useEffect } from 'react'
import API from '../../../lib/api'
import { useToast } from '../../../components/Toast'

const PAGE = 'about'

export default function AdminAbout() {
  const { addToast } = useToast()
  const [form, setForm] = useState({ aboutVideoUrl: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    API.get(`/page-meta/${PAGE}`)
      .then(({ data }) => {
        const m = data.data || {}
        setForm({ aboutVideoUrl: m.aboutVideoUrl || '' })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await API.put('/admin/page-meta', { page: PAGE, aboutVideoUrl: form.aboutVideoUrl })
      addToast('About page updated', 'success')
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loading"><div className="admin-loader" /><p>Loading...</p></div>

  return (
    <>
      <div className="admin-page-header">
        <h1><i className="fa-solid fa-circle-info" /> About Page</h1>
      </div>

      <form onSubmit={handleSave}>
        <div className="admin-form-card" style={{ marginBottom: 20 }}>
          <h3 className="admin-section-title"><i className="fa-solid fa-video" /> About Video</h3>
          <div className="admin-form-group">
            <label>Video URL</label>
            <input
              type="text" value={form.aboutVideoUrl}
              onChange={e => setForm({ aboutVideoUrl: e.target.value })}
              placeholder="https://example.com/video.mp4 or YouTube embed URL"
              style={{ fontFamily: 'monospace', fontSize: 13 }}
            />
            <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
              Paste the URL of the video you want to show on the About page.
            </p>
          </div>
          {form.aboutVideoUrl && (
            <div style={{ marginTop: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Preview:</label>
              <video controls style={{ maxWidth: 400, maxHeight: 300, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <source src={form.aboutVideoUrl} type="video/mp4" />
              </video>
            </div>
          )}
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? <><i className="fa-solid fa-spinner fa-spin" /> Saving...</> : <><i className="fa-solid fa-floppy-disk" /> Save</>}
          </button>
        </div>
      </form>
    </>
  )
}
