'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePageMetaFromAdmin } from '../../context/SeoContext'
import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../../components/ProductCard'
import SubBanner from '../../components/SubBanner'
import API from '../../lib/api'

const CAT_PAGE_MAP = {
  'sleeping pills': '/sleeping-pills',
  'painkillers':    '/painkillers',
  'anxiety pills':  '/anxiety',
}

export default function Shop() {
  usePageMetaFromAdmin('/shop', 'Shop', 'Browse our wide range of medicines and healthcare products.')

  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [sort, setSort] = useState('')
  const [page, setPage] = useState(1)
  const [sideCats, setSideCats] = useState([])

  useEffect(() => {
    API.get('/categories?limit=100')
      .then(({ data }) => setSideCats(data.categories || []))
      .catch(() => {})
  }, [])

  const { products, loading, error, total, pages } = useProducts({ search, sort, page, limit: 9 })

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
      <SubBanner title="Shop" description="Our one-stop shop for prescription and OTC medicines — fast, safe, and reliable delivery to your door." page="Shop" />

      <section className="shop-con feature-con position-relative float-left w-100 padding-top padding-bottom">
        <div className="main-container">
          <div className="row">
            <div className="sidebar sticky-sidebar col-lg-3">
              <div className="theiaStickySidebar">
                <div className="widget widget-newsletter" data-aos="fade-up">
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
                <div className="widget widget-categories" data-aos="fade-up">
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
                  <div className="top-icons" data-aos="fade-up">
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
                  <div className="shop-state shop-state-error"><p>{error}</p></div>
                ) : products.length === 0 ? (
                  <div className="shop-state shop-state-empty">
                    <i className="fa-solid fa-box-open shop-state-icon" /><p>No products found.</p>
                  </div>
                ) : (
                  <div className="row best-products-con" data-aos="fade-up">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} layout="grid" />
                    ))}
                  </div>
                )}

                {pages > 1 && (
                  <ul className="pagination" data-aos="fade-up">
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
    </>
  )
}
