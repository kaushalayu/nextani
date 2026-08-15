'use client'

import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../../components/ProductCard'
import { usePageMeta } from '../../context/SeoContext'
import SubBanner from '../../components/SubBanner'
import SeoTextBlock from '../../components/SeoTextBlock'
import FaqAccordion from '../../components/FaqAccordion'
import JsonLd from '../../components/JsonLd'
import Link from 'next/link'

const sleepFaqs = [
  { question: 'Do sleeping pills require a prescription?', answer: 'No prescription required for eligible sleep aids at Painomed. Order online and get fast delivery.' },
  { question: 'How do I choose a sleep aid?', answer: 'The appropriate option depends on your individual circumstances. Review product information and consult a healthcare professional when needed.' },
  { question: 'Can sleep medicines interact with other medicines?', answer: 'Yes, some medicines can interact with other medicines or substances. Seek professional advice before combining treatments.' },
  { question: 'How should I use a sleep aid?', answer: 'Always follow the dosage and usage instructions provided with the product or by your healthcare professional.' },
  { question: 'What if my sleep problems continue?', answer: 'Persistent sleep problems should be discussed with a qualified healthcare professional to identify possible underlying causes.' },
]

const sleepSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': 'https://painomed.us/sleeping-pills/#webpage',
      url: 'https://painomed.us/sleeping-pills/',
      name: 'Buy Sleeping Pills Online | Painomed',
      description: 'Shop quality sleep aids at Painomed — trusted options to help you fall asleep faster and stay asleep longer.',
      isPartOf: { '@id': 'https://painomed.us/#website' },
      inLanguage: 'en-US',
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://painomed.us/sleeping-pills/#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://painomed.us/' },
        { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://painomed.us/shop/' },
        { '@type': 'ListItem', position: 3, name: 'Sleeping Pills', item: 'https://painomed.us/sleeping-pills/' },
      ],
    },
  ],
}

export default function SleepingPills() {
  usePageMeta('Buy Sleeping Pills & Sleep Aids Online', 'Shop quality sleep aids at Painomed — trusted options to help you fall asleep faster and stay asleep longer.', 'sleeping pills, sleep aids', '/sleeping-pills')
  const { products, loading } = useProducts({ badge: 'sleep aid', limit: 20 })

  const sleepItemList = {
    '@type': 'ItemList',
    name: 'Sleeping Pills',
    url: 'https://painomed.us/sleeping-pills/',
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `https://painomed.us/product/${p.slug || p._id}`,
    })),
  }

  const sleepFaqSchema = {
    '@type': 'FAQPage',
    mainEntity: sleepFaqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  return (
    <>
      <SubBanner title="Sleeping Pills" description="Quality sleep aids to help you get the rest you deserve." page="Sleeping Pills" />
      <div className="cat-page">
      <div className="container">
        <h2>Sleeping Pills</h2>
        {loading ? <p>Loading...</p> : (
          <div className="row">{products.map((p, i) => <ProductCard key={p._id} product={p} layout="grid" eager={i === 0} />)}</div>
        )}
      </div>
    </div>
    <section className="cat-info-section cat-info-text-first">
      <div className="container">
        <div className="cat-info-grid">
          <div className="cat-info-content">
            <span className="cat-info-tag">Sleep Aid Safety</span>
            <h2>Important Information About Sleep Aids</h2>
            <p>Sleep medicines and sleep aids can have different effects, strengths, and safety considerations. Always review the product information carefully and follow the directions provided by your healthcare professional.</p>
            <p>If you take other medicines, have an existing medical condition, or experience persistent sleep problems, speak with a qualified healthcare professional before using a sleep aid.</p>
            <Link href="/contact" className="cat-info-btn">Contact Our Support Team</Link>
          </div>
          <div className="cat-info-media">
            <img src="/assets/images/main-abt-img2.jpg" alt="Important Information About Sleep Aids" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
    <SeoTextBlock>
      <h2>Buy Quality Sleep Aids Online</h2>
      <p>A good night&apos;s sleep is essential for your health, and our sleeping pills category brings you trusted sleep aids that help you fall asleep faster and stay asleep longer. Whether you struggle with occasional sleeplessness or ongoing sleep disruption, we offer options suited to different needs.</p>
      <p>Every sleep aid in our range is sourced from verified manufacturers and checked by our pharmacy team for quality and safety. No prescription required for eligible sleep aids — order discreetly online, choose secure payment including Bitcoin, and receive your order with fast, reliable delivery across the USA.</p>
      <h3>How to Choose a Sleep Aid</h3>
      <ul>
        <li>Consider the strength and how quickly it works</li>
        <li>Read the product page for dosing and safety details</li>
        <li>No prescription required for eligible sleep aids</li>
        <li>Ask our 24/7 support team for guidance if unsure</li>
      </ul>
      <p>Browse the sleep aids above, review the product information carefully, and add the one that fits your needs to your cart. Always follow the recommended dosage and consult your healthcare provider if sleep problems persist.</p>
    </SeoTextBlock>

    <section className="cat-faq-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Common Questions</span>
          <h2 className="section-title">Frequently Asked Questions About Sleep Aids</h2>
        </div>
        <FaqAccordion items={sleepFaqs} />
      </div>
    </section>

    <JsonLd data={{ ...sleepSchema, '@graph': [...sleepSchema['@graph'], sleepItemList, sleepFaqSchema] }} />
    </>
  )
}
