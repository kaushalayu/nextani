'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import API from '../lib/api'

const imgUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('/uploads')) return `${process.env.NEXT_PUBLIC_API_URL}${url}`
  return url
}

export default function SubBanner({ title, description, page }) {
  const pathname = usePathname()
  const [bannerImage, setBannerImage] = useState('')

  useEffect(() => {
    const route = pathname.replace(/\/\d+$/, '') || '/'
    API.get(`/page-meta/${encodeURIComponent(route)}`)
      .then(({ data }) => {
        if (data.data?.bannerImage) setBannerImage(data.data.bannerImage)
      })
      .catch(() => {})
  }, [pathname])

  const bgStyle = bannerImage
    ? { backgroundImage: `url(${imgUrl(bannerImage)})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }
    : {}

  return (
    <div className="padding-rl float-left w-100">
      <section className="float-left w-100 sub-banner-con position-relative d-flex align-items-center justify-content-center br-30" style={bgStyle}>
        <div className="sub-banner-overlay" />
        <div className="main-container position-relative">
          <div className="col-xl-12 col-lg-12 mr-auto ml-auto">
            <div className="sub-banner-inner-con text-center">
              <h1>{title}</h1>
              <p>{description}</p>
              <div className="breadcrumb-con d-inline-block">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">{page}</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
