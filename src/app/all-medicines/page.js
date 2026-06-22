'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useProducts } from '../../hooks/useProducts'

export default function AllMedicines() {
  const [search, setSearch] = useState('')
  const { products, loading, error } = useProducts({ limit: 200, sort: 'name' })

  const filtered = useMemo(() => {
    if (!search.trim()) return products
    const q = search.toLowerCase()
    return products.filter((p) => {
      const name = (p.name || '').toLowerCase()
      const desc = (p.shortDescription || '').toLowerCase()
      const badge = (p.badge || '').toLowerCase()
      return name.includes(q) || desc.includes(q) || badge.includes(q)
    })
  }, [products, search])

  const grouped = useMemo(() => {
    if (!filtered.length) return {}
    const map = {}
    filtered.forEach((p) => {
      const letter = (p.name || '')[0].toUpperCase()
      if (!map[letter]) map[letter] = []
      map[letter].push(p)
    })
    const sorted = {}
    Object.keys(map).sort().forEach((k) => { sorted[k] = map[k] })
    return sorted
  }, [filtered])

  const letters = Object.keys(grouped)

  const scrollToLetter = (l) => {
    const el = document.getElementById(`letter-${l}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const hasResults = filtered.length > 0

  const imgUrl = (img) => {
    if (!img) return '/assets/images/best-product1.png'
    if (img.startsWith('/uploads')) return `${process.env.NEXT_PUBLIC_API_URL}${img}`
    return img
  }

  return (
    <div className="all-medicines-page">
      <div className="container">
        <div className="medicines-banner">
          <h1>All Medicines</h1>
          <p>Browse our complete A-Z directory of medicines and healthcare products.</p>
          <div className="breadcrumb">
            <span className="breadcrumb-item"><Link href="/">Home</Link></span>
            <span className="breadcrumb-item active" aria-current="page">All Medicines</span>
          </div>
        </div>

        <div className="medicines-search-box">
          <span className="search-icon">&#x1F50D;</span>
          <input
            type="text"
            placeholder="Search medicines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear-btn" onClick={() => setSearch('')}>
              <span>&#x2715;</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="medicines-loading">
            <span className="loading-spinner" />
            <p>Loading medicines...</p>
          </div>
        ) : error ? (
          <div className="medicines-loading medicines-loading-error">{error}</div>
        ) : !hasResults ? (
          <div className="medicines-loading">
            <span className="medicines-empty-icon">&#x1F50D;</span>
            <p className="medicines-empty-text">
              {search ? `No medicines match "${search}"` : 'No medicines found.'}
            </p>
          </div>
        ) : (
          <>
            <div className="alpha-nav">
              {letters.map((l) => (
                <button key={l} className="alpha-btn" onClick={() => scrollToLetter(l)}>{l}</button>
              ))}
            </div>

            {search && (
              <p className="search-result-count">{filtered.length} result{filtered.length !== 1 ? 's' : ''} found</p>
            )}

            <div className="medicines-list">
              {letters.map((l) => (
                <div key={l} id={`letter-${l}`} className="letter-group">
                  <div className="letter-header">{l}</div>
                  <div className="letter-items">
                    {grouped[l].map((p) => (
                      <Link key={p._id} href={`/product/${p.slug || p._id}`} className="medicine-item">
                        <div className="medicine-item-img">
                          <img
                            src={imgUrl(p.image)}
                            alt={p.name}
                          />
                        </div>
                        <div className="medicine-item-info">
                          <span className="medicine-item-name">{p.name}</span>
                          {p.shortDescription && <span className="medicine-item-desc">{p.shortDescription}</span>}
                        </div>
                        <div className="medicine-item-price">
                          {p.oldPrice ? (
                            <>
                              <span className="old-price">${p.oldPrice.toFixed(2)}</span>
                              <span className="current-price">${p.price.toFixed(2)}</span>
                            </>
                          ) : (
                            <span className="current-price">${p.price.toFixed(2)}</span>
                          )}
                        </div>
                        <div className="medicine-item-buy">
                          <span className="buy-btn">Buy Now</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
