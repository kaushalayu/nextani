'use client'

import { useState, useEffect } from 'react'
import API from '../../../lib/api'
import { useToast } from '../../../components/Toast'

export default function AdminSettings() {
  const { addToast } = useToast()
  const [form, setForm] = useState({
    siteName: '',
    adminEmail: '',
    smtpHost: '',
    smtpPort: '587',
    smtpSecure: false,
    smtpUser: '',
    smtpPass: '',
    smtpFrom: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [showPass, setShowPass] = useState(false)

  useEffect(() => {
    API.get('/settings')
      .then(({ data }) => {
        const s = data.settings || {}
        const smtp = s.smtp || {}
        setForm({
          siteName: s.siteName || '',
          adminEmail: s.adminEmail || '',
          smtpHost: smtp.host || '',
          smtpPort: String(smtp.port || 587),
          smtpSecure: !!smtp.secure,
          smtpUser: smtp.user || '',
          smtpPass: smtp.pass || '',
          smtpFrom: smtp.from || '',
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(prev => ({ ...prev, [e.target.name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await API.put('/settings', {
        siteName: form.siteName,
        adminEmail: form.adminEmail,
        smtp: {
          host: form.smtpHost,
          port: Number(form.smtpPort) || 587,
          secure: form.smtpSecure,
          user: form.smtpUser,
          pass: form.smtpPass,
          from: form.smtpFrom,
        },
      })
      addToast('Settings saved', 'success')
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save settings', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async () => {
    setTesting(true)
    try {
      const { data } = await API.post('/settings/test')
      addToast(data.message || 'Test email sent', 'success')
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to send test email', 'error')
    } finally {
      setTesting(false)
    }
  }

  if (loading) return <div className="admin-loading"><div className="admin-loader" /><p>Loading settings...</p></div>

  const i = (label, name, opts = {}) => (
    <div className="admin-form-group">
      <label>{label}</label>
      <input name={name} value={form[name]} onChange={handleChange} type={opts.type || 'text'} placeholder={opts.placeholder || ''} />
    </div>
  )

  return (
    <>
      <div className="admin-page-header">
        <h1><i className="fa-solid fa-gear" /> Site Settings</h1>
      </div>

      <form onSubmit={handleSave}>
        {/* General */}
        <div className="admin-form-card" style={{ marginBottom: 20 }}>
          <h3 className="admin-section-title"><i className="fa-solid fa-building-shield" /> General</h3>
          <div className="admin-form-grid">
            {i('Site Name', 'siteName', { placeholder: 'Painomed' })}
            {i('Admin Notification Email', 'adminEmail', { placeholder: 'admin@example.com', type: 'email' })}
          </div>
          <p style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>
            New order, contact message and call-back request notifications are sent to this email.
          </p>
        </div>

        {/* SMTP */}
        <div className="admin-form-card" style={{ marginBottom: 20 }}>
          <h3 className="admin-section-title"><i className="fa-solid fa-envelope-open-text" /> SMTP / Email</h3>
          <div className="admin-form-grid">
            {i('SMTP Host', 'smtpHost', { placeholder: 'smtp.gmail.com' })}
            {i('SMTP Port', 'smtpPort', { placeholder: '587' })}
            <div className="admin-form-group">
              <label>SMTP Security</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 400 }}>
                <input name="smtpSecure" type="checkbox" checked={form.smtpSecure} onChange={handleChange} />
                Use SSL/TLS (port 465)
              </label>
            </div>
            {i('SMTP Username', 'smtpUser', { placeholder: 'you@gmail.com' })}
            <div className="admin-form-group">
              <label>SMTP Password</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  name="smtpPass"
                  value={form.smtpPass}
                  onChange={handleChange}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  style={{ flex: 1 }}
                  autoComplete="new-password"
                />
                <button type="button" className="admin-btn" onClick={() => setShowPass(prev => !prev)} title={showPass ? 'Hide' : 'Show'}>
                  <i className={`fa-solid ${showPass ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
            </div>
            {i('SMTP From Email', 'smtpFrom', { placeholder: 'no-reply@painomed.us', type: 'email' })}
          </div>
          <p style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>
            Leave fields empty to use the values configured on the server (.env file). For Gmail, enable 2-step
            verification and use an app password.
          </p>
        </div>

        <div className="admin-form-actions">
          <button
            type="button"
            className="admin-btn"
            onClick={handleTest}
            disabled={testing}
            style={{ marginRight: 10 }}
          >
            {testing ? <><i className="fa-solid fa-spinner fa-spin" /> Sending...</> : <><i className="fa-solid fa-paper-plane" /> Send Test Email</>}
          </button>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? <><i className="fa-solid fa-spinner fa-spin" /> Saving...</> : <><i className="fa-solid fa-floppy-disk" /> Save Settings</>}
          </button>
        </div>
      </form>
    </>
  )
}
