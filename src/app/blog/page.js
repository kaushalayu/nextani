'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import API from '../../lib/api'

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/blogs?limit=20')
      .then(({ data }) => setPosts(data.blogs || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="blog-page">
      <div className="container" style={{ padding: '40px 0' }}>
        <h1>Our Blog</h1>
        {loading ? <p>Loading...</p> : (
          <div className="row">
            {posts.map(post => (
              <div className="col-lg-4 col-md-6" key={post._id}>
                <div className="blog-card">
                  <div className="blog-image-wrap">
                    <img loading="lazy" src={post.image?.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL}${post.image}` : post.image || '/assets/images/blog-image1.jpg'} alt={post.title} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                  </div>
                  <div className="blog-content" style={{ padding: '16px' }}>
                    <h3><Link href={`/blog/${post.slug || post._id}`}>{post.title}</Link></h3>
                    <p>{post.excerpt || post.content?.slice(0, 150)}</p>
                    <Link href={`/blog/${post.slug || post._id}`}>Read More</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

