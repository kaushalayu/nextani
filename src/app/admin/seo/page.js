'use client'

import { useState, useEffect } from 'react'
import API from '../../../lib/api'
import { useToast } from '../../../components/Toast'

const imgUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('/uploads')) return `${process.env.NEXT_PUBLIC_API_URL}${url}`
  return url
}

export default function AdminSeo() {
  const { addToast } = useToast()
  const [form, setForm] = useState({
    siteTitle: '', siteDescription: '', siteKeywords: '',
    siteIcon: '', ogTitle: '', ogDescription: '', ogImage: '',
    footerText: '', whatsappNumber: '', supportEmail: '',
    contactPhone: '', address: '', businessHours: '',
    mapEmbedUrl: '', bitcoinAddress: '',
    facebook: '', instagram: '', linkedin: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [iconFile, setIconFile] = useState(null)
  const [ogFile, setOgFile] = useState(null)

  useEffect(() => {
    API.get('/seo').then(({ data }) => {
      const s = data.seo || {}
      setForm({
        siteTitle: s.siteTitle || '',
        siteDescription: s.siteDescription || '',
        siteKeywords: s.siteKeywords || '',
        siteIcon: s.siteIcon || '',
        ogTitle: s.ogTitle || '',
        ogDescription: s.ogDescription || '',
        ogImage: s.ogImage || '',
        footerText: s.footerText || '',
        whatsappNumber: s.whatsappNumber || '',
        supportEmail: s.supportEmail || '',
        contactPhone: s.contactPhone || '',
        address: s.address || '',
        businessHours: s.businessHours || '',
        mapEmbedUrl: s.mapEmbedUrl || '',
        bitcoinAddress: s.bitcoinAddress || '',
        facebook: s.socialLinks?.facebook || '',
        instagram: s.socialLinks?.instagram || '',
        linkedin: s.socialLinks?.linkedin || '',
      })
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { ogImage: _, siteIcon: __, ...payload } = form
      const { data } = await API.put('/admin/seo', {
        ...payload,
        socialLinks: { facebook: form.facebook, instagram: form.instagram, linkedin: form.linkedin },
      })
      if (data.seo) {
        setForm(prev => ({
          ...prev,
          siteTitle: data.seo.siteTitle || '',
          siteDescription: data.seo.siteDescription || '',
          siteKeywords: data.seo.siteKeywords || '',
          footerText: data.seo.footerText || '',
          whatsappNumber: data.seo.whatsappNumber || '',
          supportEmail: data.seo.supportEmail || '',
          contactPhone: data.seo.contactPhone || '',
          address: data.seo.address || '',
          businessHours: data.seo.businessHours || '',
          mapEmbedUrl: data.seo.mapEmbedUrl || '',
          bitcoinAddress: data.seo.bitcoinAddress || '',
          ogTitle: data.seo.ogTitle || '',
          ogDescription: data.seo.ogDescription || '',
          facebook: data.seo.socialLinks?.facebook || '',
          instagram: data.seo.socialLinks?.instagram || '',
          linkedin: data.seo.socialLinks?.linkedin || '',
        }))
      }
      addToast('SEO settings saved', 'success')

      if (iconFile) {
        const fd = new FormData()
        fd.append('icon', iconFile)
        const { data: iconData } = await API.post('/admin/seo/upload-icon', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        if (iconData.seo?.siteIcon) {
          setForm(prev => ({ ...prev, siteIcon: iconData.seo.siteIcon }))
        }
        setIconFile(null)
      }
      if (ogFile) {
        const fd = new FormData()
        fd.append('ogImage', ogFile)
        const { data: ogData } = await API.post('/admin/seo/upload-og-image', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        if (ogData.seo?.ogImage) {
          setForm(prev => ({ ...prev, ogImage: ogData.seo.ogImage }))
        }
        setOgFile(null)
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loading"><div className="admin-loader" /><p>Loading SEO settings...</p></div>

  const i = (label, name, opts = {}) => (
    <div className="admin-form-group">
      <label>{label}</label>
      {opts.type === 'textarea' ? (
        <textarea name={name} value={form[name]} onChange={handleChange} rows={opts.rows || 3} placeholder={opts.placeholder || ''} />
      ) : (
        <input name={name} value={form[name]} onChange={handleChange} type={opts.type || 'text'} placeholder={opts.placeholder || ''} />
      )}
    </div>
  )

  return (
    <>
      <div className="admin-page-header">
        <h1><i className="fa-solid fa-globe" /> SEO Settings</h1>
      </div>

      <form onSubmit={handleSave}>
        {/* General */}
        <div className="admin-form-card" style={{ marginBottom: 20 }}>
          <h3 className="admin-section-title"><i className="fa-solid fa-gear" /> General</h3>
          <div className="admin-form-grid">
            {i('Site Title', 'siteTitle')}
            {i('Meta Keywords', 'siteKeywords')}
            <div className="admin-form-full">{i('Meta Description', 'siteDescription', { type: 'textarea', rows: 2 })}</div>
            <div className="admin-form-full">{i('Footer Text', 'footerText', { type: 'textarea', rows: 2 })}</div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="admin-form-card" style={{ marginBottom: 20 }}>
          <h3 className="admin-section-title"><i className="fa-solid fa-address-book" /> Contact Information</h3>
          <div className="admin-form-grid">
            {i('WhatsApp Number', 'whatsappNumber')}
            {i('Support Email', 'supportEmail')}
            {i('Contact Phone', 'contactPhone')}
            {i('Business Hours', 'businessHours')}
            <div className="admin-form-full">{i('Address', 'address', { type: 'textarea', rows: 2 })}</div>
            <div className="admin-form-full">{i('Google Maps Embed URL', 'mapEmbedUrl', { type: 'textarea', rows: 2, placeholder: '<iframe src=...' })}</div>
          </div>
        </div>

        {/* Social Links */}
        <div className="admin-form-card" style={{ marginBottom: 20 }}>
          <h3 className="admin-section-title"><i className="fa-solid fa-share-nodes" /> Social Links</h3>
          <div className="admin-form-grid">
            {i('Facebook URL', 'facebook', { placeholder: 'https://facebook.com/...' })}
            {i('Instagram URL', 'instagram', { placeholder: 'https://instagram.com/...' })}
            {i('LinkedIn URL', 'linkedin', { placeholder: 'https://linkedin.com/...' })}
          </div>
        </div>

        {/* Open Graph */}
        <div className="admin-form-card" style={{ marginBottom: 20 }}>
          <h3 className="admin-section-title"><i className="fa-solid fa-image" /> Open Graph</h3>
          <div className="admin-form-grid">
            {i('OG Title', 'ogTitle')}
            <div className="admin-form-full">{i('OG Description', 'ogDescription', { type: 'textarea', rows: 2 })}</div>
            <div className="admin-form-group">
              <label>OG Image</label>
              {form.ogImage ? (
                <div style={{ marginBottom: 8 }}>
                  <img loading="lazy" src={imgUrl(form.ogImage)} alt="OG" style={{ maxWidth: 200, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                </div>
              ) : (
                <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>No OG image uploaded</p>
              )}
              <input type="file" accept="image/*" onChange={e => setOgFile(e.target.files[0])} />
              {ogFile && <span style={{ fontSize: 12, color: '#059669' }}>New file selected: {ogFile.name}</span>}
            </div>
          </div>
        </div>

        {/* Bitcoin / Crypto */}
        <div className="admin-form-card" style={{ marginBottom: 20 }}>
          <h3 className="admin-section-title"><i className="fa-brands fa-bitcoin" /> Bitcoin / Crypto Payment</h3>
          <div className="admin-form-grid">
            <div className="admin-form-full">
              {i('Bitcoin Wallet Address', 'bitcoinAddress', { placeholder: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' })}
              <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                This address will be shown to customers during checkout when they select Bitcoin as payment method.
              </p>
            </div>
          </div>
        </div>

        {/* Site Icon */}
        <div className="admin-form-card" style={{ marginBottom: 20 }}>
          <h3 className="admin-section-title"><i className="fa-solid fa-pen-ruler" /> Site Icon / Favicon</h3>
          <div className="admin-form-group">
            <label>Current Icon</label>
            {form.siteIcon ? (
              <div style={{ marginBottom: 8 }}>
                <img loading="lazy" src={imgUrl(form.siteIcon)} alt="Favicon" style={{ maxWidth: 64, maxHeight: 64, borderRadius: 4, border: '1px solid #e2e8f0' }} />
              </div>
            ) : (
              <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>No custom icon uploaded (using default favicon)</p>
            )}
            <input type="file" accept="image/*" onChange={e => setIconFile(e.target.files[0])} />
            {iconFile && <span style={{ fontSize: 12, color: '#059669' }}>New file selected: {iconFile.name}</span>}
          </div>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? <><i className="fa-solid fa-spinner fa-spin" /> Saving...</> : <><i className="fa-solid fa-floppy-disk" /> Save All Settings</>}
          </button>
        </div>
      </form>
    </>
  )
}
