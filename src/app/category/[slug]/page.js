'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useProducts } from '../../../hooks/useProducts'
import ProductCard from '../../../components/ProductCard'
import { usePageMeta } from '../../../context/SeoContext'
import SubBanner from '../../../components/SubBanner'
import API from '../../../lib/api'

export default function CategoryPage() {
  const { slug } = useParams()
  const [cat, setCat] = useState(null)

  useEffect(() => {
    if (!slug) return
    API.get(`/categories?limit=100`)
      .then(({ data }) => {
        const found = (data.categories || []).find(c => c.slug === slug)
        setCat(found || null)
      })
      .catch(() => setCat(null))
  }, [slug])

  const { products, loading } = useProducts(
    cat ? { category: cat._id, limit: 50 } : { limit: 0 }
  )

  const title = cat?.name || slug?.replace(/-/g, ' ') || 'Category'
  const desc = cat?.description || `Browse our ${title.toLowerCase()}`
  usePageMeta(title, desc, `category, ${title.toLowerCase()}`, `/category/${slug}`)

  return (
    <>
      <SubBanner title={title} description={desc} page={title} />
      <div className="cat-page">
        <div className="container">
          <h1>{title}</h1>
          {!cat ? (
            <p>Category not found.</p>
          ) : loading ? (
            <p>Loading...</p>
          ) : products.length === 0 ? (
            <p>No products in this category yet.</p>
          ) : (
            <div className="row">
              {products.map(p => <ProductCard key={p._id} product={p} layout="grid" />)}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
