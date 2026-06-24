'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import API from '../../lib/api'
import { usePageMetaFromAdmin } from '../../context/SeoContext'
import SubBanner from '../../components/SubBanner'

export default function Blog() {
  usePageMetaFromAdmin('/blog', 'Blog', 'Read our latest blog posts about health and wellness.')

  const [activeTab, setActiveTab] = useState('All')
  const [blogs, setBlogs] = useState([])
  const [categories, setCategories] = useState(['All'])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const LIMIT = 9

  useEffect(() => {
    API.get('/blogs/categories')
      .then(({ data }) => {
        if (data.success) setCategories(data.categories)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ page, limit: LIMIT })
    if (activeTab !== 'All') params.append('category', activeTab)
    API.get(`/blogs?${params}`)
      .then(({ data }) => {
        if (data.success) {
          setBlogs(data.blogs)
          setTotalPages(data.pages)
        }
      })
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false))
  }, [activeTab, page])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setPage(1)
  }

  const imgSrc = (img) => {
    if (!img) return '/assets/images/single-blog-tab-img1.jpg'
    if (img.startsWith('/uploads')) return `${process.env.NEXT_PUBLIC_API_URL}${img}`
    if (img.startsWith('http')) return img
    return `/assets/images/${img}`
  }

  return (
    <>
      <SubBanner title="Our Blog" description="Trusted source for prescription and over-the-counter medicines — delivered with care and confidence." page="Blog" />

      <div className="blog-tabs-section padding-top padding-bottom float-left w-100">
        <div className="container">
          <div className="blog-tabs-inner-section">
            <ul className="nav nav-tabs">
              {categories.map((tab) => (
                <li key={tab} className="nav-item">
                  <span
                    className={`nav-link${activeTab === tab ? ' active' : ''}`}
                    onClick={() => handleTabChange(tab)}
                    className="blog-tab-link"
                  >
                    {tab}
                  </span>
                </li>
              ))}
            </ul>

            <div className="tab-content">
              <div className="tab-pane fade show active">
                {loading ? (
                  <div className="blog-state">
                    <i className="fa-solid fa-spinner fa-spin blog-state-icon" />
                    <p className="blog-state-text">Loading blogs...</p>
                  </div>
                ) : blogs.length === 0 ? (
                  <div className="blog-state">
                    <i className="fa-regular fa-newspaper blog-state-icon-lg" />
                    <p>No blog posts found in this category.</p>
                    <p className="blog-state-hint">Admin can add blog posts from the admin panel.</p>
                  </div>
                ) : (
                  <div className="single-blog-outer-con">
                    {blogs.map((post) => (
                      <div key={post._id} className="single-blog-box">
                        <figure className="mb-0">
                          <img
                            src={imgSrc(post.image)}
                            alt={post.title}
                            loading="lazy"
                            className="img-fluid"
                            className="blog-list-img"
                          />
                        </figure>
                        <div className="single-blog-details">
                          <ul className="list-unstyled">
                            <li className="position-relative">
                              <i className="fas fa-user" /> Posted by {post.author || 'Admin'}
                            </li>
                            <li className="position-relative">
                              <i className="fas fa-calendar-alt" />
                              {' '}{new Date(post.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric'
                              })}
                            </li>
                            <li className="position-relative">
                              <i className="fas fa-tag" /> {post.category}
                            </li>
                          </ul>
                          <h4><Link href={`/blog/${post.slug || post._id}`}>{post.title}</Link></h4>
                          <p>
                            {post.excerpt || post.content?.slice(0, 120)}
                            {(post.content?.length > 120) ? '...' : ''}
                          </p>
                          <div className="generic-btn2">
                            <Link href={`/blog/${post.slug || post._id}`}>Read More</Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {totalPages > 1 && (
              <nav aria-label="Blog pagination">
                <ul className="pagination">
                  <li className={`page-item${page === 1 ? ' disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setPage(p => p - 1)}
                      disabled={page === 1}
                    >
                      <i className="fas fa-angle-left" />
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li key={i + 1} className={`page-item${page === i + 1 ? ' active' : ''}`}>
                      <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
                    </li>
                  ))}
                  <li className={`page-item${page === totalPages ? ' disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setPage(p => p + 1)}
                      disabled={page === totalPages}
                    >
                      <i className="fas fa-angle-right" />
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
