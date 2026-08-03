'use client'

export default function SeoTextBlock({ children }) {
  return (
    <section className="seo-text-block">
      <div className="container">
        <div className="seo-text-inner">
          {children}
        </div>
      </div>
    </section>
  )
}
