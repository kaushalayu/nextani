'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePageMetaFromAdmin } from '../../context/SeoContext'
import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../../components/ProductCard'
import SubBanner from '../../components/SubBanner'
import JsonLd from '../../components/JsonLd'
import API from '../../lib/api'

const shopSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': 'https://painomed.us/shop/#webpage',
      url: 'https://painomed.us/shop/',
      name: 'Shop | Painomed',
      description: 'Browse healthcare products, medicines, wellness products and healthcare essentials available from Painomed.',
      isPartOf: { '@id': 'https://painomed.us/#website' },
      inLanguage: 'en-US',
    },
    {
      '@type': 'ItemList',
      '@id': 'https://painomed.us/shop/#itemlist',
      name: 'Painomed Healthcare Products',
      description: 'Healthcare products and wellness products available through Painomed.',
      numberOfItems: 0,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://painomed.us/shop/#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://painomed.us/' },
        { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://painomed.us/shop/' },
      ],
    },
  ],
}

const CAT_PAGE_MAP = {
  'sleeping pills': '/sleeping-pills',
  'painkillers':    '/painkillers',
  'anxiety pills':  '/anxiety',
}

export default function Shop() {
  usePageMetaFromAdmin('/shop', 'Shop Medicines & Healthcare Products Online', "Browse Painomed's wide range of medicines and healthcare products online. Secure checkout, discreet packaging and fast delivery.")

  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [sort, setSort] = useState('')
  const [page, setPage] = useState(1)
  const [sideCats, setSideCats] = useState([])
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('search') || ''
    if (q) {
      setSearch(q)
      setSearchInput(q)
      setPage(1)
    }
  }, [])

  useEffect(() => {
    API.get('/categories?limit=100')
      .then(({ data }) => setSideCats(data.categories || []))
      .catch(() => {})
  }, [])

  const { products, loading, error, total, pages, refetch } = useProducts({ search, sort, page, limit: 9 })

  const shopItemList = {
    '@type': 'ItemList',
    '@id': 'https://painomed.us/shop/#itemlist',
    name: 'Painomed Healthcare Products',
    description: 'Healthcare products and wellness products available through Painomed.',
    numberOfItems: total || 0,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `https://painomed.us/product/${p.slug || p._id}`,
    })),
  }

  const catPath = (cat) => {
    const key = cat.name.toLowerCase().trim()
    return CAT_PAGE_MAP[key] || `/category/${cat.slug}`
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  return (
    <>
      <SubBanner title="Shop" description="No prescription required for eligible medicines — fast, safe, and reliable delivery across the USA." page="Shop" />

      <section className="shop-con feature-con position-relative float-left w-100 padding-top padding-bottom">
        <div className="main-container">
          <div className="row">
            <button
              type="button"
              className="shop-filter-toggle"
              aria-expanded={mobileFilterOpen}
              onClick={() => setMobileFilterOpen(v => !v)}
            >
              <i className="fa-solid fa-sliders" /> {mobileFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
            <div className={`sidebar sticky-sidebar col-lg-3${mobileFilterOpen ? ' mobile-open' : ''}`}>
              <div className="theiaStickySidebar">
                <div className="widget widget-newsletter">
                  <form onSubmit={handleSearch} className="form-inline">
                    <div className="input-group">
                      <input type="text" className="form-control widget-search-form" placeholder="Search" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                      <div className="input-group-append">
                        <span className="input-group-btn">
                          <button type="submit" className="btn"><i className="fa fa-search" /></button>
                        </span>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="widget widget-categories">
                  <div className="widget-title font_weight_600">Categories :</div>
                  <ul className="list-unstyled mb-0">
                    {sideCats.map(c => (
                      <li key={c._id} className="cat-item">
                        <Link href={catPath(c)} className="d-block">{c.name}</Link>
                      </li>
                    ))}
                    <li className="cat-item"><Link href="/new-arrivals" className="d-block">New Arrivals</Link></li>
                    <li className="cat-item"><Link href="/best-sellers" className="d-block">Best Sellers</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-lg-9">
              <div className="row default-sorting-con">
                <div className="col-12">
                  <div className="top-icons">
                    <div className="icons-list"><span>Showing {products.length} of {total} results</span></div>
                    <div id="toolbar">
                      <select className="form-control" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1) }}>
                        <option value="">Default Sorting</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="rating">Top Rated</option>
                        <option value="name">Name A-Z</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="shop-box-wrapper">
                {loading ? (
                  <div className="shop-state shop-state-loading">
                    <i className="fa-solid fa-spinner fa-spin shop-state-icon" /><p>Loading products...</p>
                  </div>
                ) : error ? (
                  <div className="shop-state shop-state-error">
                    <p>{error}</p>
                    <button className="btn btn-primary mt-2" onClick={refetch}><i className="fa-solid fa-rotate mr-1" /> Retry</button>
                  </div>
                ) : products.length === 0 ? (
                  <div className="shop-state shop-state-empty">
                    <i className="fa-solid fa-box-open shop-state-icon" /><p>No products found.</p>
                  </div>
                ) : (
                  <div className="row best-products-con">
              {products.map((product, index) => (
                        <ProductCard key={product._id} product={product} layout="grid" eager={index === 0} />
                    ))}
                  </div>
                )}

                {pages > 1 && (
                  <ul className="pagination">
                    {page > 1 && (
                      <li className="page-item">
                        <button className="page-link" onClick={() => setPage(p => p - 1)}><i className="fas fa-angle-left" /></button>
                      </li>
                    )}
                    {Array.from({ length: pages }, (_, i) => (
                      <li key={i + 1} className={`page-item${page === i + 1 ? ' active' : ''}`}>
                        <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
                      </li>
                    ))}
                    {page < pages && (
                      <li className="page-item">
                        <button className="page-link" onClick={() => setPage(p => p + 1)}><i className="fas fa-angle-right" /></button>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={{ ...shopSchema, '@graph': [...shopSchema['@graph'], shopItemList] }} />
    </>
  )
}
