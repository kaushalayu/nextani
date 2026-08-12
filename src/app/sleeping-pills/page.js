'use client'

import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../../components/ProductCard'
import { usePageMeta } from '../../context/SeoContext'
import SubBanner from '../../components/SubBanner'
import SeoTextBlock from '../../components/SeoTextBlock'
import FaqAccordion from '../../components/FaqAccordion'
import JsonLd from '../../components/JsonLd'

const sleepFaqs = [
  { question: 'What sleep aids does Painomed offer?', answer: 'Painomed offers a range of sleep aids selected for their quality and reliability, including options to help you fall asleep faster and stay asleep longer.' },
  { question: 'Do I need a prescription to buy sleeping pills?', answer: 'Prescription requirements depend on the product and applicable regulations. Certain sleep medicines require a valid prescription, which you can upload during checkout for verification.' },
  { question: 'How quickly will a sleep aid work?', answer: 'The time for a sleep aid to take effect varies by product and individual response. Always follow the dosage instructions and the advice of your healthcare provider.' },
  { question: 'How should I choose the right sleep aid?', answer: 'Consider the strength, how quickly it works, and whether a prescription is required. Read the product page for dosing and safety details, and ask our 24/7 support team for guidance if unsure.' },
  { question: 'Are sleeping pills safe for daily use?', answer: 'Sleep aids should be used as directed and for the appropriate duration. Avoid combining with alcohol and consult a healthcare professional before regular or long-term use.' },
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
      inLanguage: 'en-AU',
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
  usePageMeta('Sleeping Pills', 'Quality sleep aids to help you get the rest you deserve.', 'sleeping pills, sleep aids', '/sleeping-pills')
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
          <div className="row">{products.map(p => <ProductCard key={p._id} product={p} layout="grid" />)}</div>
        )}
      </div>
    </div>
    <SeoTextBlock>
      <h2>Buy Quality Sleep Aids Online</h2>
      <p>A good night&apos;s sleep is essential for your health, and our sleeping pills category brings you trusted sleep aids that help you fall asleep faster and stay asleep longer. Whether you struggle with occasional sleeplessness or ongoing sleep disruption, we offer options suited to different needs.</p>
      <p>Every sleep aid in our range is sourced from verified manufacturers and checked by our pharmacy team for quality and safety. You can order discreetly online, choose secure payment including Bitcoin, and receive your order with fast, reliable delivery.</p>
      <h3>How to Choose a Sleep Aid</h3>
      <ul>
        <li>Consider the strength and how quickly it works</li>
        <li>Read the product page for dosing and safety details</li>
        <li>Check whether a prescription is required</li>
        <li>Ask our 24/7 support team for guidance if unsure</li>
      </ul>
      <p>Browse the sleep aids above, review the product information carefully, and add the one that fits your needs to your cart. Always follow the recommended dosage and consult your healthcare provider if sleep problems persist.</p>
    </SeoTextBlock>

    <section className="cat-faq-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Common Questions</span>
          <h2 className="section-title">Sleep Aid FAQs</h2>
        </div>
        <FaqAccordion items={sleepFaqs} />
      </div>
    </section>

    <JsonLd data={{ ...sleepSchema, '@graph': [...sleepSchema['@graph'], sleepItemList, sleepFaqSchema] }} />
    </>
  )
}
