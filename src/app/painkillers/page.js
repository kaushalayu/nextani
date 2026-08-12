'use client'

import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../../components/ProductCard'
import { usePageMeta } from '../../context/SeoContext'
import SubBanner from '../../components/SubBanner'
import SeoTextBlock from '../../components/SeoTextBlock'
import FaqAccordion from '../../components/FaqAccordion'
import JsonLd from '../../components/JsonLd'

const painkillersFaqs = [
  { question: 'What painkillers does Painomed offer?', answer: 'Painomed offers a range of pain relief medicines selected for their quality and reliability. Available products include options for various types of discomfort, from everyday aches to more persistent pain.' },
  { question: 'Do I need a prescription to buy painkillers?', answer: 'Prescription requirements depend on the product and applicable regulations. Certain stronger pain medicines require a valid prescription, which you can upload during checkout for verification.' },
  { question: 'How should I take pain relief medicine?', answer: 'Always follow the dosage instructions on the product label and any advice from your healthcare provider. Do not exceed the recommended dose and seek medical advice if pain persists.' },
  { question: 'Can I use painkillers alongside other medicines?', answer: 'Some medicines can interact. If you take other medications or have underlying health conditions, consult a healthcare professional before using a new pain relief product.' },
  { question: 'Is my painkiller order delivered discreetly?', answer: 'Yes. Orders are packed securely and discreetly and delivered to your chosen address, with tracking details provided once your order is dispatched.' },
]

const painkillersSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': 'https://painomed.us/painkillers/#webpage',
      url: 'https://painomed.us/painkillers/',
      name: 'Buy Painkillers Online | Painomed',
      description: 'Shop painkillers and pain relief medicines at Painomed — effective solutions for various types of discomfort.',
      isPartOf: { '@id': 'https://painomed.us/#website' },
      inLanguage: 'en-AU',
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://painomed.us/painkillers/#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://painomed.us/' },
        { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://painomed.us/shop/' },
        { '@type': 'ListItem', position: 3, name: 'Painkillers', item: 'https://painomed.us/painkillers/' },
      ],
    },
  ],
}

export default function Painkillers() {
  usePageMeta('Painkillers', 'Effective pain relief solutions for various types of discomfort.', 'painkillers, pain relief', '/painkillers')
  const { products, loading } = useProducts({ badge: 'painkiller', limit: 20 })

  const painkillersItemList = {
    '@type': 'ItemList',
    name: 'Painkillers',
    url: 'https://painomed.us/painkillers/',
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `https://painomed.us/product/${p.slug || p._id}`,
    })),
  }

  const painkillersFaqSchema = {
    '@type': 'FAQPage',
    mainEntity: painkillersFaqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  return (
    <>
      <SubBanner title="Painkillers" description="Effective pain relief solutions for various types of discomfort." page="Painkillers" />
      <div className="cat-page">
        <div className="container">
          <h2>Painkillers</h2>
          {loading ? <p>Loading...</p> : (
            <div className="row">{products.map(p => <ProductCard key={p._id} product={p} layout="grid" />)}</div>
          )}
        </div>
      </div>
      <SeoTextBlock>
        <h2>Buy Pain Relief Medicines Online</h2>
        <p>Pain can be distracting, exhausting, and hard to live with. At Painomed, we offer a carefully selected range of pain relief medicines designed to help you manage discomfort and get back to your day. From everyday aches to more persistent pain, our products are sourced from verified manufacturers and reviewed by our licensed pharmacy team.</p>
        <p>We handle your order with complete discretion and deliver it safely and quickly to your doorstep. Prescription medicines require a valid prescription, which you can upload during checkout.</p>
        <h3>Common Options for Pain Relief</h3>
        <ul>
          <li>Medicines for everyday aches and headaches</li>
          <li>Support for muscle and joint discomfort</li>
          <li>Options for more persistent pain management</li>
          <li>Discreet packaging and private, secure ordering</li>
        </ul>
        <p>Read each product page for dosing guidance and safety information. If you have questions about which option may suit your situation, our customer care team is available 24/7 to guide you.</p>
      </SeoTextBlock>

      <section className="cat-faq-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Common Questions</span>
            <h2 className="section-title">Painkiller FAQs</h2>
          </div>
          <FaqAccordion items={painkillersFaqs} />
        </div>
      </section>

      <JsonLd data={{ ...painkillersSchema, '@graph': [...painkillersSchema['@graph'], painkillersItemList, painkillersFaqSchema] }} />
    </>
  )
}
