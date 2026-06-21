'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import API from '../../../lib/api'
import { BlogPostSchema, BreadcrumbSchema } from '../../../components/Seo/SchemaMarkup'

export default function BlogDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get(`/blogs/${id}`)
      .then(({ data }) => setPost(data.blog || data))
      .catch(() => setPost(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}><p>Loading...</p></div>
  if (!post) return <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}><h3>Blog not found</h3><Link href="/blog">Back to Blog</Link></div>

  return (
    <>
      <BlogPostSchema post={post} />
      <BreadcrumbSchema items={[
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: post.title, path: `/blog/${id}` },
      ]} />
      <div className="blog-detail-page">
        <div className="container" style={{ padding: '40px 0' }}>
          <h1>{post.title}</h1>
          {post.image && (
            <img loading="lazy" src={post.image?.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL}${post.image}` : post.image}
              alt={post.title} style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 12, marginBottom: 24 }} />
          )}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
    </>
  )
}

