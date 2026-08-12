'use client'

import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../../components/ProductCard'
import { usePageMeta } from '../../context/SeoContext'
import SubBanner from '../../components/SubBanner'
import SeoTextBlock from '../../components/SeoTextBlock'
import FaqAccordion from '../../components/FaqAccordion'
import JsonLd from '../../components/JsonLd'

const anxietyFaqs = [
  { question: 'What anxiety relief medicines does Painomed offer?', answer: 'Painomed offers a range of anxiety relief medicines selected for their quality and reliability. Available products include medicines used to support calm, manage stress, and relieve symptoms of anxiety where appropriate.' },
  { question: 'Do I need a prescription to buy anxiety medicines?', answer: 'Yes. Prescription-only anxiety medicines require a valid prescription from a licensed healthcare provider, which you can upload during checkout for verification.' },
  { question: 'How quickly does anxiety relief medicine work?', answer: 'The time for a medicine to take effect varies by product and individual response. Always follow the dosage instructions provided and the advice of your healthcare provider.' },
  { question: 'Are anxiety relief medicines safe to use?', answer: 'When used as directed and under appropriate medical guidance, anxiety medicines can be safe. Follow product guidance, avoid exceeding recommended doses, and consult a healthcare professional if you have questions.' },
  { question: 'How is my anxiety medicine order delivered?', answer: 'Your order is packed securely and discreetly and delivered to your chosen address. Once dispatched, you can track your order using the tracking details provided.' },
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
      inLanguage: 'en-AU',
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
  usePageMeta('Anxiety Relief', 'Effective anxiety relief medications to help you manage stress and find calm.', 'anxiety relief, calm', '/anxiety')
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
          <div className="row">{products.map(p => <ProductCard key={p._id} product={p} layout="grid" />)}</div>
        )}
      </div>
    </div>
    <SeoTextBlock>
      <h2>Buy Anxiety Relief Medicines Online</h2>
      <p>Anxiety can affect anyone at any time, and finding the right relief makes all the difference. At Painomed, we offer a carefully selected range of anxiety relief medicines designed to help you manage stress, reduce panic symptoms, and restore a sense of calm to your daily routine.</p>
      <p>All anxiety medications in this category are sourced from verified manufacturers and reviewed by our licensed pharmacy team. We handle your order with complete discretion and deliver it safely and quickly to your doorstep. Prescription medicines require a valid prescription, which you can upload during checkout.</p>
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
          <h2 className="section-title">Anxiety Medicine FAQs</h2>
        </div>
        <FaqAccordion items={anxietyFaqs} />
      </div>
    </section>

    <JsonLd data={{ ...anxietySchema, '@graph': [...anxietySchema['@graph'], anxietyItemList, anxietyFaqSchema] }} />
    </>
  )
}
