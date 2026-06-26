'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import API from '../../../lib/api'
import { useToast } from '../../../components/Toast'

export default function AdminProducts() {
  const { addToast } = useToast()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const loadProducts = () => {
    API.get('/products?limit=100')
      .then(({ data }) => setProducts(data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadProducts() }, [])

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This action cannot be undone.`)) return
    try {
      await API.delete(`/products/${id}`)
      addToast('Product deleted', 'success')
      loadProducts()
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete product', 'error')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Products</h2>
        <Link href="/admin/products/new" style={{ background: '#6366f1', color: '#fff', padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>+ Add Product</Link>
      </div>
      {loading ? <p>Loading...</p> : (
        <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <table className="table mb-0">
            <thead><tr><th>Name</th><th>Price</th><th>Category</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>${(p.price || 0).toFixed(2)}</td>
                  <td>{p.category?.name || '-'}</td>
                  <td><span className={`badge bg-${p.isActive ? 'success' : 'secondary'}`}>{p.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link href={`/admin/products/edit/${p._id}`} className="btn btn-sm btn-outline-primary">Edit</Link>
                      <button onClick={() => handleDelete(p._id, p.name)} className="btn btn-sm btn-outline-danger"><i className="fa-solid fa-trash" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
