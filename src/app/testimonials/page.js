'use client'

import { useState, useEffect } from 'react'
import API from '../../lib/api'
import SubBanner from '../../components/SubBanner'

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/testimonials').then(({ data }) => setTestimonials(data.testimonials || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const imgUrl = (img) => {
    if (!img) return '/assets/images/client-img1.jpg'
    if (img.startsWith('/uploads')) return `${process.env.NEXT_PUBLIC_API_URL}${img}`
    return img
  }

  return (
    <>
      <SubBanner title="Testimonials" description="Read what our customers say about Pharmez. Real reviews from real customers who trust us for their medicine delivery needs." page="Testimonials" />

      <div className="testimonials-page">
        <div className="main-container">
          <div className="testimonials-header">
            <span className="testimonials-special-text">Testimonials</span>
            <h2>What Our Customers Say</h2>
            <p>Real reviews from real customers who trust us for their medicine delivery needs.</p>
          </div>
          {loading ? (
            <div className="testimonials-loading">
              <i className="fa-solid fa-spinner fa-spin testimonials-loading-icon" />
              <p className="testimonials-loading-text">Loading testimonials...</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="testimonials-loading"><p>No testimonials yet.</p></div>
          ) : (
            <div className="testimonials-grid">
              {testimonials.map((t) => (
                <div key={t._id} className="testimonial-card">
                  <div className="testimonial-card-header">
                    <img src={imgUrl(t.image)} alt={t.name} className="testimonial-card-avatar" />
                    <div>
                      <h5 className="testimonial-card-name">{t.name}</h5>
                      <span className="testimonial-card-role">{t.role || 'Happy Customer'}</span>
                    </div>
                  </div>
                  <div className="testimonial-card-stars">
                    {[...Array(5)].map((_, s) => (
                      <i key={s} className={`fa-star ${s < (t.rating || 5) ? 'fa-solid' : 'fa-regular'} testimonial-star`} />
                    ))}
                  </div>
                  <p className="testimonial-card-text">&ldquo;{t.text}&rdquo;</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
