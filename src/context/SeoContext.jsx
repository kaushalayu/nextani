'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import API from '../lib/api'

const SeoContext = createContext()

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

export function usePageMeta(title, description, keywords) {
  const { seo } = useSeo()

  useEffect(() => {
    const siteName = seo?.siteTitle || 'Painomed - Online Pharmacy'
    const siteShort = siteName.replace(/ - .*$/, '').trim() || 'Painomed'
    const fullTitle = title ? `${title} | ${siteShort}` : siteName
    document.title = fullTitle

    let metaDesc = document.querySelector('meta[name="description"]')
    const desc = description || seo?.siteDescription || 'Painomed - Online Pharmacy | Fast & Trusted Medicine Delivery'
    if (metaDesc) {
      metaDesc.setAttribute('content', desc)
    } else {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      metaDesc.setAttribute('content', desc)
      document.head.appendChild(metaDesc)
    }

    let metaKeywords = document.querySelector('meta[name="keywords"]')
    const kw = keywords || seo?.siteKeywords || 'painomed, online pharmacy'
    if (metaKeywords) {
      metaKeywords.setAttribute('content', kw)
    } else {
      metaKeywords = document.createElement('meta')
      metaKeywords.setAttribute('name', 'keywords')
      metaKeywords.setAttribute('content', kw)
      document.head.appendChild(metaKeywords)
    }

    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', fullTitle)

    let ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc) ogDesc.setAttribute('content', desc)
  }, [title, description, keywords, seo])
}

export function usePageMetaFromAdmin(page, fallbackTitle, fallbackDesc) {
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
    pageMeta?.keywords || undefined
  )
}
