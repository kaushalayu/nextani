'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import API from '../../../lib/api'
import { BlogPostSchema, BreadcrumbSchema } from '../../../components/Seo/SchemaMarkup'
import { usePageMeta } from '../../../context/SeoContext'
import SubBanner from '../../../components/SubBanner'

export default function BlogDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  usePageMeta(
    post?.title ? `${post.title} - Blog` : 'Blog Post',
    post?.excerpt || post?.content?.slice(0, 160) || 'Read our latest blog post.'
  )

  useEffect(() => {
    API.get(`/blogs/${id}`).then(({ data }) => setPost(data.blog || data)).catch(() => setPost(null)).finally(() => setLoading(false))
  }, [id])

  const bannerDesc = useMemo(() => {
    if (!post?.excerpt) return ''
    return post.excerpt.length > 120 ? post.excerpt.slice(0, 120) + '...' : post.excerpt
  }, [post])

  if (loading) return (
    <>
      <SubBanner title="Blog" description="Loading..." page="Blog" />
      <div className="blog-detail-page"><div className="blog-detail-container blog-detail-center"><p>Loading...</p></div></div>
    </>
  )
  if (!post) return (
    <>
      <SubBanner title="Blog" description="Post not found" page="Blog" />
      <div className="blog-detail-page"><div className="blog-detail-container blog-detail-center"><h3>Blog not found</h3><Link href="/blog" className="blog-detail-back">Back to Blog</Link></div></div>
    </>
  )

  return (
    <>
      <BlogPostSchema post={post} />
      <BreadcrumbSchema items={[
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: post.title, path: `/blog/${id}` },
      ]} />
      <SubBanner title={post.title} description={bannerDesc} page="Blog" />

      <div className="blog-detail-page">
        <div className="blog-detail-container">
          {post.image && (
            <img loading="lazy" className="blog-detail-image"
              src={post.image?.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL}${post.image}` : post.image}
              alt={post.title} />
          )}
          <div className="blog-detail-meta">
            {post.createdAt && <span><i className="fa-regular fa-calendar" />{new Date(post.createdAt).toLocaleDateString()}</span>}
            {post.author && <span><i className="fa-regular fa-user" />{post.author}</span>}
          </div>
          <div className="blog-detail-content" dangerouslySetInnerHTML={{ __html: post.content }} />
          <Link href="/blog" className="blog-detail-back">
            <i className="fa-solid fa-arrow-left" /> Back to Blog
          </Link>
        </div>
      </div>
    </>
  )
}
