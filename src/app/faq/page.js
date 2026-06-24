'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePageMetaFromAdmin } from '../../context/SeoContext'
import API from '../../lib/api'
import SubBanner from '../../components/SubBanner'

export default function FAQ() {
  usePageMetaFromAdmin('/faq', 'FAQ', 'Frequently asked questions about Painomed online pharmacy.')

  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [openIndex, setOpenIndex] = useState(null)

  useEffect(() => {
    API.get('/faqs').then(({ data }) => setFaqs(data.faqs)).catch(() => setFaqs([])).finally(() => setLoading(false))
  }, [])

  const toggleFAQ = (index) => setOpenIndex(openIndex === index ? null : index)

  return (
    <>
      <SubBanner title="Frequently Asked Questions" description="Find answers to common questions about our products, orders, and delivery services." page="FAQ" />

      <div className="float-left w-100 faq-con position-relative padding-top padding-bottom padding-rl">
        <div className="main-container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-12">
              <div className="faq-list">
                {loading ? (
                  <div className="faq-state">
                    <i className="fa-solid fa-spinner fa-spin faq-state-icon" />
                    <p>Loading FAQs...</p>
                  </div>
                ) : faqs.length === 0 ? (
                  <div className="faq-state"><p>No FAQs available at the moment.</p></div>
                ) : (
                  faqs.map((item, index) => (
                    <div key={item._id} className={`faq-item${openIndex === index ? ' open' : ''}`}>
                      <div className="faq-question" onClick={() => toggleFAQ(index)}>
                        <span>{item.question}</span>
                        <i className="fa-solid fa-chevron-down" />
                      </div>
                      <div className={`faq-answer${openIndex === index ? '' : ' faq-answer-hidden'}`}>{item.answer}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
