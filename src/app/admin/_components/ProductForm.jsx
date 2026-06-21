'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import API from '../../../lib/api'

export default function AdminProductForm({ productId }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(!!productId)
  const [categories, setCategories] = useState([])

  const [form, setForm] = useState({
    name: '', description: '', shortDescription: '', badge: '', tags: '',
    price: '', oldPrice: '', stock: '', sku: '', brand: 'Pharmez Healthcare',
    category: '', image: '', isFeatured: false, isNewArrival: false,
    isBestSeller: false, isActive: true, hasPillsOptions: false,
    pillsOptions: [], howToUse: '', sideEffects: '', ingredients: '',
    additionalInfo: '',
  })

  const [pillsRows, setPillsRows] = useState([{ count: '', price: '', oldPrice: '', stock: '' }])
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  useEffect(() => {
    API.get('/categories?limit=100')
      .then(({ data }) => setCategories(data.categories || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!productId) return
    setFetching(true)
    API.get(`/products/${productId}`)
      .then(({ data }) => {
        const p = data.product
        setForm({
          name: p.name || '', description: p.description || '',
          shortDescription: p.shortDescription || '', badge: p.badge || '',
          tags: (p.tags || []).join(', '), price: p.price || '',
          oldPrice: p.oldPrice || '', stock: p.stock || '', sku: p.sku || '',
          brand: p.brand || 'Pharmez Healthcare',
          category: p.category?._id || p.category || '',
          image: p.image || '', isFeatured: p.isFeatured || false,
          isNewArrival: p.isNewArrival || false, isBestSeller: p.isBestSeller || false,
          isActive: p.isActive !== false, hasPillsOptions: p.hasPillsOptions || false,
          pillsOptions: p.pillsOptions || [], howToUse: p.howToUse || '',
          sideEffects: p.sideEffects || '', ingredients: p.ingredients || '',
          additionalInfo: p.additionalInfo || '',
        })
        if (p.pillsOptions?.length > 0) {
          setPillsRows(p.pillsOptions.map(o => ({
            count: o.count, price: o.price, oldPrice: o.oldPrice || '', stock: o.stock || '',
          })))
        }
        if (p.image) {
          setImagePreview(p.image.startsWith('/uploads')
            ? `${process.env.NEXT_PUBLIC_API_URL}${p.image}`
            : p.image)
        }
      })
      .catch(() => alert('Failed to load product'))
      .finally(() => setFetching(false))
  }, [productId])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handlePillsChange = (idx, field, value) => {
    setPillsRows(prev => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row))
  }

  const addPillsRow = () => setPillsRows(prev => [...prev, { count: '', price: '', oldPrice: '', stock: '' }])
  const removePillsRow = (idx) => setPillsRows(prev => prev.filter((_, i) => i !== idx))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('description', form.description)
    formData.append('shortDescription', form.shortDescription)
    formData.append('badge', form.badge)
    formData.append('tags', JSON.stringify(form.tags.split(',').map(t => t.trim()).filter(Boolean)))
    formData.append('price', form.price)
    formData.append('oldPrice', form.oldPrice || 0)
    formData.append('stock', form.stock || 0)
    formData.append('sku', form.sku)
    formData.append('brand', form.brand)
    formData.append('category', form.category)
    formData.append('isFeatured', form.isFeatured)
    formData.append('isNewArrival', form.isNewArrival)
    formData.append('isBestSeller', form.isBestSeller)
    formData.append('isActive', form.isActive)
    formData.append('hasPillsOptions', form.hasPillsOptions)
    formData.append('howToUse', form.howToUse)
    formData.append('sideEffects', form.sideEffects)
    formData.append('ingredients', form.ingredients)
    formData.append('additionalInfo', form.additionalInfo)

    if (form.hasPillsOptions) {
      formData.append('pillsOptions', JSON.stringify(pillsRows
        .filter(r => r.count && r.price)
        .map(r => ({ count: Number(r.count), price: Number(r.price), oldPrice: Number(r.oldPrice) || 0, stock: Number(r.stock) || 0 }))
      ))
    }

    if (imageFile) {
      formData.append('image', imageFile)
    }

    try {
      if (productId) {
        await API.put(`/products/${productId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      } else {
        await API.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }
      router.push('/admin/products')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div style={{ padding: 40, textAlign: 'center' }}>Loading product...</div>

  const inputStyle = {
    width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8,
    fontSize: 14, outline: 'none', boxSizing: 'border-box',
  }
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }
  const sectionStyle = { background: '#fff', borderRadius: 12, padding: 24, marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>{productId ? 'Edit Product' : 'Add New Product'}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => router.push('/admin/products')}
            style={{ padding: '8px 20px', border: '1px solid #d1d5db', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 14 }}>Cancel</button>
          <button type="submit" disabled={loading}
            style={{ padding: '8px 24px', border: 'none', borderRadius: 8, background: loading ? '#9ca3af' : '#6366f1', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>

      {/* Basic Info */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#111827' }}>Basic Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Product Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>SKU</label>
            <input name="sku" value={form.sku} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Category *</label>
            <select name="category" value={form.category} onChange={handleChange} required style={inputStyle}>
              <option value="">Select category...</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Brand</label>
            <input name="brand" value={form.brand} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Price *</label>
            <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Old Price</label>
            <input name="oldPrice" type="number" step="0.01" value={form.oldPrice} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Stock</label>
            <input name="stock" type="number" value={form.stock} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Badge</label>
            <input name="badge" value={form.badge} onChange={handleChange} placeholder="e.g. Sale, New" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Tags (comma separated)</label>
            <input name="tags" value={form.tags} onChange={handleChange} placeholder="tag1, tag2" style={inputStyle} />
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <label style={labelStyle}>Short Description</label>
          <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} rows={2} style={inputStyle} />
        </div>
        <div style={{ marginTop: 12 }}>
          <label style={labelStyle}>Full Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={4} style={inputStyle} />
        </div>
      </div>

      {/* Image */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#111827' }}>Product Image</h3>
        <input type="file" accept="image/*" onChange={(e) => {
          const file = e.target.files[0]
          if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)) }
        }} />
        {imagePreview && <img loading="lazy" src={imagePreview} alt="Preview" style={{ maxWidth: 200, maxHeight: 200, marginTop: 12, borderRadius: 8, objectFit: 'cover' }} />}
      </div>

      {/* Pills Options */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Pills Options</h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
            <input type="checkbox" name="hasPillsOptions" checked={form.hasPillsOptions} onChange={handleChange} />
            Enable Pills Options
          </label>
        </div>
        {form.hasPillsOptions && (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead><tr style={{ background: '#f9fafb' }}>
                <th style={thStyle}>Count</th><th style={thStyle}>Price</th><th style={thStyle}>Old Price</th><th style={thStyle}>Stock</th><th style={{ width: 50 }}></th>
              </tr></thead>
              <tbody>
                {pillsRows.map((row, i) => (
                  <tr key={i}>
                    <td style={tdStyle}><input value={row.count} onChange={e => handlePillsChange(i, 'count', e.target.value)} type="number" placeholder="e.g. 15" style={inputStyle} /></td>
                    <td style={tdStyle}><input value={row.price} onChange={e => handlePillsChange(i, 'price', e.target.value)} type="number" step="0.01" placeholder="0.00" style={inputStyle} /></td>
                    <td style={tdStyle}><input value={row.oldPrice} onChange={e => handlePillsChange(i, 'oldPrice', e.target.value)} type="number" step="0.01" placeholder="0.00" style={inputStyle} /></td>
                    <td style={tdStyle}><input value={row.stock} onChange={e => handlePillsChange(i, 'stock', e.target.value)} type="number" placeholder="0" style={inputStyle} /></td>
                    <td style={tdStyle}>
                      <button type="button" onClick={() => removePillsRow(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16 }}><i className="fa-solid fa-trash" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" onClick={addPillsRow} style={{ marginTop: 8, padding: '6px 16px', border: '1px dashed #6366f1', borderRadius: 8, background: '#f5f3ff', color: '#6366f1', cursor: 'pointer', fontSize: 13 }}>+ Add Option</button>
          </>
        )}
      </div>

      {/* Flags */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#111827' }}>Visibility & Flags</h3>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {[
            { name: 'isFeatured', label: 'Featured Product' },
            { name: 'isNewArrival', label: 'New Arrival' },
            { name: 'isBestSeller', label: 'Best Seller' },
            { name: 'isActive', label: 'Active' },
          ].map(flag => (
            <label key={flag.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }}>
              <input type="checkbox" name={flag.name} checked={form[flag.name]} onChange={handleChange} />
              {flag.label}
            </label>
          ))}
        </div>
      </div>

      {/* Detailed Info */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#111827' }}>Detailed Information</h3>
        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <label style={labelStyle}>How to Use</label>
            <textarea name="howToUse" value={form.howToUse} onChange={handleChange} rows={3} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Side Effects</label>
            <textarea name="sideEffects" value={form.sideEffects} onChange={handleChange} rows={3} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Ingredients</label>
            <textarea name="ingredients" value={form.ingredients} onChange={handleChange} rows={3} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Additional Information</label>
            <textarea name="additionalInfo" value={form.additionalInfo} onChange={handleChange} rows={3} style={inputStyle} />
          </div>
        </div>
      </div>
    </form>
  )
}

const thStyle = { padding: '8px 12px', textAlign: 'left', fontWeight: 600, borderBottom: '2px solid #e5e7eb', fontSize: 13 }
const tdStyle = { padding: '6px 8px', borderBottom: '1px solid #f3f4f6' }

