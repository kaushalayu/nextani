'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePageMetaFromAdmin } from '../../context/SeoContext'
import API from '../../lib/api'
import SubBanner from '../../components/SubBanner'

export default function About() {
  usePageMetaFromAdmin('/about', 'About Us', 'Learn more about Painomed - your trusted online pharmacy.')

  const [testimonials, setTestimonials] = useState([])
  const [team, setTeam] = useState([])
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    API.get('/testimonials').then(({ data }) => setTestimonials(data.testimonials || [])).catch(() => {})
    API.get('/team').then(({ data }) => setTeam(data.members || [])).catch(() => {})
    API.get('/blogs?limit=3').then(({ data }) => setBlogs(data.blogs || [])).catch(() => {})
  }, [])

  const teamImg = (img) => {
    if (!img) return '/assets/images/team-person1.jpg'
    if (img.startsWith('/uploads')) return `${process.env.NEXT_PUBLIC_API_URL}${img}`
    return img
  }

  const imgUrl = (img, fallback) => {
    if (!img) return fallback
    if (img.startsWith('/uploads')) return `${process.env.NEXT_PUBLIC_API_URL}${img}`
    return img
  }

  const truncate = (str, len) => (str && str.length > len ? str.slice(0, len) + '...' : str)

  return (
    <>
      <SubBanner title="About Us" description="Trusted source for prescription and over-the-counter medicines — delivered with care and confidence." page="About" />

      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 main-about-con position-relative padding-top padding-bottom">
          <div className="main-container">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="main-abt-content-con">
                  <div className="heading-title-con">
                    <span className="special-text d-inline-block">About Us</span>
                    <h2>Committed to Making <br />Healthcare Accessible</h2>
                    <p className="text-margin">We offer a trusted platform where you can confidently order both prescription and over-the-counter medicines online. Our team is dedicated to safety, reliability, and exceptional customer care—ensuring that you receive the medications you need, when you need them, without hassle.</p>
                    <p>With a focus on convenience and quality, we partner with licensed pharmacies and healthcare professionals. Our mission is to simplify your healthcare journey, one delivery at a time.</p>
                  </div>
                  <div className="position-relative">
                    <figure><img src="/assets/images/main-abt-img1.jpg" alt="About Painomed" className="img-fluid br-30" /></figure>
                    <div className="vid-con bg-black br-30 text-center"><a href="https://video-previews.elements.envatousercontent.com/a8007808-5900-46c3-92dc-9c4dc55afd78/watermarked_preview/watermarked_preview.mp4" className="popup-vimeo d-inline-block"><img src="/assets/images/play-btn.png" alt="Play Video" className="img-fluid" /></a><span className="d-block text-white font-weight-bold">Watch Video</span></div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="main-about-img-con">
                  <figure><img src="/assets/images/main-abt-img2.jpg" alt="Pharmacy" className="img-fluid br-30" /></figure>
                  <div className="users-details-con">
                    <div className="user-detrail-box">
                      <span className="d-inline-block counter">98</span><span className="d-inline-block alphabet">%</span>
                      <p className="mb-0">Customer Satisfaction</p>
                    </div>
                    <div className="user-detrail-box">
                      <span className="d-inline-block counter">10</span><span className="d-inline-block alphabet">M</span><span className="d-inline-block alphabet">+</span>
                      <p className="mb-0">Orders Delivered</p>
                    </div>
                    <div className="user-detrail-box border-right-0">
                      <span className="d-inline-block counter">500</span><span className="d-inline-block alphabet">+</span>
                      <p className="mb-0">Pharmacy Partners</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 benefits-con background-lemon">
          <div className="main-container">
            <div className="benefits-inner-con">
              <ul className="d-flex list-unstyled p-0 mb-0 align-items-center justify-content-between">
                {[
                  { img: '/assets/images/benefits-icon1.png', title: 'Free Shipping & Returns', desc: 'For all order over $200' },
                  { img: '/assets/images/benefits-icon2.png', title: 'Secure Payment', desc: 'Ensure Secure Payment' },
                  { img: '/assets/images/benefits-icon3.png', title: 'Money Back Guarantee', desc: 'Returning Money in 30 days' },
                  { img: '/assets/images/benefits-icon4.png', title: '24/7 Customer Support', desc: 'Friendly Customer Support' },
                ].map((item, i) => (
                  <li key={i} className="position-relative d-flex align-items-center">
                    <figure><img src={item.img} alt={item.title} className="img-fluid" /></figure>
                    <div className="sub-info-inner">
                      <h6>{item.title}</h6>
                      <p className="mb-0 sub-p">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
      <div className="spacer" />

      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 position-relative how-it-works-con br-30">
          <figure className="pharmz-icon"><img src="/assets/images/capsule-icon.png" alt="Painomed" className="position-absolute img-fluid" /></figure>
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-lg-7 col-md-6">
                <div className="work-img-con">
                  <figure><img src="/assets/images/work-img.jpg" alt="How it works" className="img-fluid" /></figure>
                </div>
              </div>
              <div className="col-lg-5 col-md-6">
                <div className="work-content-con">
                  <div className="heading-title-con">
                    <span className="special-text d-inline-block text-lemon">Our Process</span>
                    <h2 className="mb-0 text-white">How it Works</h2>
                  </div>
                  <ul className="list-unstyled p-0 mb-0 position-relative">
                    <li className="position-relative d-flex align-items-center">
                      <figure><img src="/assets/images/work-icon2.png" alt="Choose Products" className="img-fluid" /></figure>
                      <div className="sub-info-inner">
                        <h6>Choose Your Products</h6>
                        <p className="mb-0 sub-p">Browse and select the medicines or health products you need.</p>
                      </div>
                    </li>
                    <li className="position-relative d-flex align-items-center">
                      <figure><img src="/assets/images/work-icon3.png" alt="Delivery" className="img-fluid" /></figure>
                      <div className="sub-info-inner">
                        <h6>Get It Delivered</h6>
                        <p className="mb-0 sub-p">Receive your order at your doorstep — fast, safe, and hassle-free.</p>
                      </div>
                    </li>
                  </ul>
                  <Link href="/shop" className="text-decoration-none primary_btn d-inline-block">Shop Now</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 our-team-con padding-top padding-bottom position-relative br-30">
          <div className="main-container">
            <div className="heading-title-con text-center">
              <span className="special-text d-inline-block">Our Team</span>
              <h2>The People Behind the Care</h2>
            </div>
            {team.length === 0 ? (
              <div className="about-state"><p>Loading team members...</p></div>
            ) : (
              <div className="row all_row">
                {team.map((member) => (
                  <div key={member._id} className="col-lg-3 col-md-6 all_column">
                    <div className="team-box text-center position-relative all_boxes">
                      <figure><img src={teamImg(member.image)} alt={member.name} className="img-fluid" /></figure>
                      <h5>{member.name}</h5>
                      <span className="designation text-color d-block">{member.role}</span>
                      <ul className="list-unstyled p-0 mb-0">
                        {member.socialLinks?.facebook && <li className="d-inline-block"><a href={member.socialLinks.facebook} className="ml-0" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-facebook-f" /></a></li>}
                        {member.socialLinks?.instagram && <li className="d-inline-block"><a href={member.socialLinks.instagram} target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-instagram" /></a></li>}
                        {member.socialLinks?.linkedin && <li className="d-inline-block"><a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-linkedin" /></a></li>}
                        {member.socialLinks?.twitter && <li className="d-inline-block"><a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-twitter" /></a></li>}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="padding-rl float-left w-100">
        <div className="client-review-slider w-100 float-left padding-top padding-bottom position-relative main-box br-30">
          <div className="container">
            <figure><img src="/assets/images/left-quote.png" alt="quote" className="position-absolute left-quote" /></figure>
            <figure><img src="/assets/images/right-quote.png" alt="quote" className="position-absolute right-quote" /></figure>
            <div className="heading-title-con text-center">
              <span className="special-text d-inline-block text-lemon">Testimonials</span>
              <h2 className="mb-0">Our Client Reviews</h2>
            </div>
            {testimonials.length === 0 ? (
              <div className="about-state"><p>Loading testimonials...</p></div>
            ) : (
              <div className="client-review-slider-inner-con">
                <div id="about_testimonial_slider" className="carousel slide" data-ride="carousel">
                  <div className="carousel-inner">
                    {testimonials.map((t, i) => (
                      <div key={t._id} className={`carousel-item${i === 0 ? ' active' : ''}`}>
                        <div className="client-review-box">
                          <figure className="rating-stars">
                            {[...Array(5)].map((_, s) => (
                              <i key={s} className={`fa-star ${s < t.rating ? 'fa-solid' : 'fa-regular'} about-star`} />
                            ))}
                          </figure>
                          <p className="review-text">&ldquo;{t.text}&rdquo;</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {testimonials.length > 1 && (
                    <>
                      <ul className="carousel-indicators">
                        {testimonials.map((t, i) => (
                          <li key={t._id} data-target="#about_testimonial_slider" data-slide-to={i} className={i === 0 ? 'active' : ''}>
                            <figure className="mb-0">
                              <img src={imgUrl(t.image, '/assets/images/client-img1.jpg')} alt={t.name} className="img-fluid" />
                            </figure>
                            <div className="name_wrapper">
                              <p className="client-name">{t.name}</p>
                              <span className="d-block">{t.role || 'Happy Customer'}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="pagination-outer">
                        <a className="carousel-control-prev" href="#about_testimonial_slider" role="button" data-slide="prev">
                          <i className="prev-arrow fa-solid fa-arrow-left" /><span className="sr-only">Previous</span>
                        </a>
                        <a className="carousel-control-next" href="#about_testimonial_slider" role="button" data-slide="next">
                          <i className="next-arrow fa-solid fa-arrow-right" /><span className="sr-only">Next</span>
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 news-and-articles-con padding-top padding-bottom position-relative">
          <div className="main-container">
            <div className="heading-title-con text-center">
              <span className="special-text d-inline-block">News & Articles</span>
              <h2 className="mb-0">Our Latest Blog Posts</h2>
            </div>
            {blogs.length === 0 ? (
              <div className="about-state"><p>Loading blog posts...</p></div>
            ) : (
              <div className="row">
                {blogs.map((post) => (
                  <div key={post._id} className="col-lg-4 col-md-6 col-sm-6 col-12 mx-auto">
                    <div className="article-box">
                      <div className="image position-relative">
                        <figure className="article-image">
                          <img src={imgUrl(post.image, '/assets/images/news-and-articles-img1.jpg')} alt={post.title} className="img-fluid" />
                        </figure>
                      </div>
                      <div className="box-content">
                        <Link href={`/blog/${post.slug || post._id}`} className="text-decoration-none">
                          <h4>{post.title}</h4>
                        </Link>
                        <p className="mb-0">{post.excerpt || truncate(post.content, 120)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
