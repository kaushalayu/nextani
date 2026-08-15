'use client'

import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../../components/ProductCard'
import { usePageMeta } from '../../context/SeoContext'
import SubBanner from '../../components/SubBanner'
import SeoTextBlock from '../../components/SeoTextBlock'
import FaqAccordion from '../../components/FaqAccordion'
import JsonLd from '../../components/JsonLd'
import Link from 'next/link'

const anxietyFaqs = [
  { question: 'Can I buy anxiety medicines online?', answer: 'Yes, you can buy eligible anxiety medicines online at Painomed — no prescription required, with discreet fast delivery across the USA.' },
  { question: 'Do anxiety medicines require a prescription?', answer: 'No prescription required for eligible anxiety medicines at Painomed. Simply add to cart and checkout.' },
  { question: 'Do I need to upload a prescription?', answer: 'No. Most anxiety medicines at Painomed can be ordered without a prescription.' },
  { question: 'How should I choose an anxiety medicine?', answer: 'The appropriate medicine depends on your individual circumstances. Consult a qualified healthcare professional rather than choosing medication based only on symptoms.' },
  { question: 'Are anxiety medicines safe?', answer: 'Medicines can have risks, side effects, and interactions. Always follow professional medical advice and the product information.' },
]

const anxietySchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': 'https://painomed.us/anxiety/#webpage',
      url: 'https://painomed.us/anxiety/',
      name: 'Buy Anxiety Relief Medicines Online | Painomed',
      description: 'Shop anxiety relief medicines at Painomed — effective options to help you manage stress, reduce panic symptoms, and restore calm.',
      isPartOf: { '@id': 'https://painomed.us/#website' },
      inLanguage: 'en-US',
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://painomed.us/anxiety/#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://painomed.us/' },
        { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://painomed.us/shop/' },
        { '@type': 'ListItem', position: 3, name: 'Anxiety Pills', item: 'https://painomed.us/anxiety/' },
      ],
    },
  ],
}

export default function Anxiety() {
  usePageMeta('Buy Anxiety Relief Medicines Online', 'Shop anxiety relief medicines at Painomed — effective options to help you manage stress, reduce panic symptoms, and restore calm.', 'anxiety relief, calm', '/anxiety')
  const { products, loading } = useProducts({ badge: 'calm', limit: 20 })

  const anxietyItemList = {
    '@type': 'ItemList',
    name: 'Anxiety Relief Medicines',
    url: 'https://painomed.us/anxiety/',
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `https://painomed.us/product/${p.slug || p._id}`,
    })),
  }

  const anxietyFaqSchema = {
    '@type': 'FAQPage',
    mainEntity: anxietyFaqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  return (
    <>
      <SubBanner title="Anxiety Pills" description="Effective anxiety relief medications to help you manage stress and find calm." page="Anxiety" />
      <div className="cat-page">
      <div className="container">
        <h2>Anxiety Relief</h2>
        {loading ? <p>Loading...</p> : (
          <div className="row">{products.map((p, i) => <ProductCard key={p._id} product={p} layout="grid" eager={i === 0} />)}</div>
        )}
      </div>
    </div>
    <section className="cat-info-section">
      <div className="container">
        <div className="cat-info-grid">
          <div className="cat-info-media">
            <img src="/assets/images/main-abt-img1.jpg" alt="Understanding Anxiety Medicines" loading="lazy" />
          </div>
          <div className="cat-info-content">
            <span className="cat-info-tag">Anxiety &amp; Medication Safety</span>
            <h2>Understanding Anxiety Medicines</h2>
            <p>Anxiety medicines can work differently from person to person, and the right treatment depends on individual needs and professional medical advice. Before using any prescription medicine, always follow your healthcare professional&apos;s instructions and read the product information carefully.</p>
            <p className="cat-info-label"><strong>Important:</strong></p>
            <ul className="cat-info-list">
              <li>No prescription required for eligible medicines — order online in minutes.</li>
              <li>Follow the recommended dosage and directions.</li>
              <li>Do not share medicines with others.</li>
              <li>Speak with a qualified healthcare professional if you have questions about your treatment.</li>
            </ul>
            <Link href="/shop" className="cat-info-btn">Learn More</Link>
          </div>
        </div>
      </div>
    </section>
    <SeoTextBlock>
      <h2>Buy Anxiety Relief Medicines Online</h2>
      <p>Anxiety can affect anyone at any time, and finding the right relief makes all the difference. At Painomed, we offer a carefully selected range of anxiety relief medicines designed to help you manage stress, reduce panic symptoms, and restore a sense of calm to your daily routine.</p>
      <p>All anxiety medications in this category are sourced from verified manufacturers and reviewed by our licensed pharmacy team. We handle your order with complete discretion and deliver it safely and quickly to your doorstep. No prescription required for eligible medicines — order online in minutes and get discreet delivery across the USA.</p>
      <h3>Common Options for Anxiety Support</h3>
      <ul>
        <li>Medications to reduce general anxiety and stress</li>
        <li>Short-term relief for panic symptoms</li>
        <li>Options to support better sleep alongside anxiety</li>
        <li>Discreet packaging and private, secure ordering</li>
      </ul>
      <p>Take your time browsing the products above and read each product page for dosing guidance and safety information. If you have questions about which option may suit your situation, our customer care team is available 24/7 to guide you.</p>
    </SeoTextBlock>

    <section className="cat-faq-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Common Questions</span>
          <h2 className="section-title">Frequently Asked Questions About Anxiety Medicines</h2>
        </div>
        <FaqAccordion items={anxietyFaqs} />
      </div>
    </section>

    <JsonLd data={{ ...anxietySchema, '@graph': [...anxietySchema['@graph'], anxietyItemList, anxietyFaqSchema] }} />
    </>
  )
}
