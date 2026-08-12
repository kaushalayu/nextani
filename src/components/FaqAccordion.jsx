'use client'

import { useState } from 'react'

export default function FaqAccordion({ items, defaultOpen = 0, className = '' }) {
  const [openIndex, setOpenIndex] = useState(defaultOpen)

  const toggle = (index) => setOpenIndex(openIndex === index ? -1 : index)

  return (
    <div className={`faq-list ${className}`}>
      {items.map((item, i) => (
        <div key={i} className={`faq-item${openIndex === i ? ' open' : ''}`}>
          <div
            className="faq-question"
            onClick={() => toggle(i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                toggle(i)
              }
            }}
          >
            <h3>{item.question}</h3>
            <i className="fa-solid fa-chevron-down" />
          </div>
          <div className={`faq-answer${openIndex === i ? '' : ' faq-answer-hidden'}`}>{item.answer}</div>
        </div>
      ))}
    </div>
  )
}
