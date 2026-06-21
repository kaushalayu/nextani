'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function GoogleAnalytics({ GA_MEASUREMENT_ID }) {
  if (!GA_MEASUREMENT_ID) return null
  return (
    <>
      <script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        async
      />
      <script
        id="google-analytics"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}

export function GAPageView({ GA_MEASUREMENT_ID }) {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: pathname,
      })
    }
  }, [pathname, GA_MEASUREMENT_ID])

  return null
}
