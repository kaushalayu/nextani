'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import API from '../lib/api'

const SeoContext = createContext()
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://painomed.us'

function setOrCreateMeta(tagName, attributes) {
  if (!attributes || !attributes.href) return
  const selector = `${tagName}[href="${attributes.href}"]`
  let el = document.querySelector(selector)
  if (!el) {
    el = document.createElement(tagName)
    Object.entries(attributes).forEach(([k, v]) => el.setAttribute(k, v))
    document.head.appendChild(el)
  }
}

function setOrCreateMetaTag(property, content) {
  if (!content) return
  const selector = `meta[property="${property}"]`
  let el = document.querySelector(selector)
  if (el) {
    el.setAttribute('content', content)
  } else {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    el.setAttribute('content', content)
    document.head.appendChild(el)
  }
}

function setOrCreateTwitterMeta(name, content) {
  if (!content) return
  const selector = `meta[name="${name}"]`
  let el = document.querySelector(selector)
  if (el) {
    el.setAttribute('content', content)
  } else {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    el.setAttribute('content', content)
    document.head.appendChild(el)
  }
}

export function SeoProvider({ children }) {
  const [seo, setSeo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/seo')
      .then(({ data }) => {
        if (data.seo) setSeo(data.seo)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <SeoContext.Provider value={{ seo, loading }}>
      {children}
    </SeoContext.Provider>
  )
}

export function useSeo() {
  const ctx = useContext(SeoContext)
  if (!ctx) throw new Error('useSeo must be used within SeoProvider')
  return ctx
}

export function usePageMeta(title, description, keywords, canonicalPath, ogImage) {
  const { seo } = useSeo()

  useEffect(() => {
    const siteName = seo?.siteTitle || 'Painomed - Online Pharmacy'
    const siteShort = siteName.replace(/ - .*$/, '').trim() || 'Painomed'
    const fullTitle = title ? `${title} | ${siteShort}` : siteName
    const desc = description || seo?.siteDescription || 'Painomed - Online Pharmacy | Fast & Trusted Medicine Delivery'
    const kw = keywords || seo?.siteKeywords || 'painomed, online pharmacy'

    document.title = fullTitle

    setOrCreateMeta('meta[name="description"]', null, 'name', 'description')
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) metaDesc.setAttribute('content', desc)

    setOrCreateMeta('meta[name="keywords"]', null, 'name', 'keywords')
    const metaKw = document.querySelector('meta[name="keywords"]')
    if (metaKw) metaKw.setAttribute('content', kw)

    const canonicalUrl = canonicalPath ? `${SITE_URL}${canonicalPath}` : SITE_URL
    setOrCreateMeta('link', { rel: 'canonical', href: canonicalUrl })

    setOrCreateMetaTag('og:title', fullTitle)
    setOrCreateMetaTag('og:description', desc)
    setOrCreateMetaTag('og:url', canonicalUrl)
    setOrCreateMetaTag('og:type', 'website')
    setOrCreateMetaTag('og:site_name', siteShort)
    setOrCreateMetaTag('og:image', ogImage || seo?.ogImage || '/logo.png')

    setOrCreateTwitterMeta('twitter:card', 'summary_large_image')
    setOrCreateTwitterMeta('twitter:title', fullTitle)
    setOrCreateTwitterMeta('twitter:description', desc)
    setOrCreateTwitterMeta('twitter:image', ogImage || seo?.ogImage || '/logo.png')
    setOrCreateTwitterMeta('twitter:site', '@painomed')
  }, [title, description, keywords, canonicalPath, ogImage, seo])
}

export function usePageMetaFromAdmin(page, fallbackTitle, fallbackDesc, canonicalPath) {
  const { seo } = useSeo()
  const [pageMeta, setPageMeta] = useState(null)

  useEffect(() => {
    if (!page) return
    API.get(`/page-meta/${encodeURIComponent(page)}`)
      .then(({ data }) => {
        if (data.data && (data.data.title || data.data.description)) {
          setPageMeta(data.data)
        }
      })
      .catch(() => {})
  }, [page])

  usePageMeta(
    pageMeta?.title || fallbackTitle,
    pageMeta?.description || fallbackDesc,
    pageMeta?.keywords || undefined,
    canonicalPath || page,
    pageMeta?.ogImage || undefined
  )
}
