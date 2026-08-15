'use client'

import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../../components/ProductCard'
import { usePageMeta } from '../../context/SeoContext'
import SubBanner from '../../components/SubBanner'
import SeoTextBlock from '../../components/SeoTextBlock'
import FaqAccordion from '../../components/FaqAccordion'
import JsonLd from '../../components/JsonLd'
import Link from 'next/link'

const painkillersFaqs = [
  { question: 'Do painkillers require a prescription?', answer: 'No prescription required for eligible painkillers at Painomed. Add to cart and order in minutes.' },
  { question: 'How do I choose the right pain relief medicine?', answer: 'The appropriate option depends on your individual needs and medical circumstances. Consult a qualified healthcare professional for advice.' },
  { question: 'Can I take painkillers with other medicines?', answer: 'Some medicines can interact with other medicines. Check with a healthcare professional before combining treatments.' },
  { question: 'Can I order painkillers online?', answer: 'Yes. Eligible painkillers can be ordered online at Painomed with no prescription required and fast delivery across the USA.' },
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
      inLanguage: 'en-US',
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
  usePageMeta('Buy Painkillers Online', 'Shop painkillers and pain relief medicines at Painomed — effective solutions for various types of discomfort with discreet delivery.', 'painkillers, pain relief', '/painkillers')
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
            <div className="row">{products.map((p, i) => <ProductCard key={p._id} product={p} layout="grid" eager={i === 0} />)}</div>
          )}
        </div>
      </div>
      <section className="cat-info-section cat-info-text-first">
        <div className="container">
          <div className="cat-info-grid">
            <div className="cat-info-content">
              <span className="cat-info-tag">Pain Relief Information</span>
              <h2>Pain Relief Medicines Online</h2>
              <p>Painomed provides convenient access to a range of pain relief medicines and healthcare products. Whether you are looking for options for occasional discomfort or ongoing pain management, explore the available products and review their individual information before placing an order.</p>
              <p>No prescription required for eligible pain relief medicines — simply add to cart and order online in minutes. Always use medicines according to the advice of your healthcare professional and the product instructions.</p>
              <Link href="/shop" className="cat-info-btn">Explore Pain Relief Products</Link>
            </div>
            <div className="cat-info-media">
              <img src="/assets/images/work-img.jpg" alt="Pain Relief Medicines Online" loading="lazy" />
            </div>
          </div>
        </div>
      </section>
      <SeoTextBlock>
        <h2>Buy Pain Relief Medicines Online</h2>
        <p>Pain can be distracting, exhausting, and hard to live with. At Painomed, we offer a carefully selected range of pain relief medicines designed to help you manage discomfort and get back to your day. From everyday aches to more persistent pain, our products are sourced from verified manufacturers and reviewed by our licensed pharmacy team.</p>
        <p>We handle your order with complete discretion and deliver it safely and quickly to your doorstep. No prescription required for eligible medicines — order online in minutes and get fast delivery across the USA.</p>
        <h3>Common Options for Pain Relief</h3>
        <ul>
          <li>Medicines for everyday aches and headaches</li>
          <li>Support for muscle and joint discomfort</li>
          <li>Options for more persistent pain management</li>
          <li>Discreet packaging and private, secure ordering</li>
        </ul>
        <p>Read each product page for dosing guidance and safety information. If you have questions about which option may suit your situation, our customer care team is available 24/7 to guide you.</p>
      </SeoTextBlock>

      <section className="cat-safety-section">
        <div className="container">
          <div className="cat-safety-grid">
            <div className="cat-safety-info">
              <span className="cat-info-tag">Safety &amp; Usage</span>
              <h2>Important Information About Pain Relief Medicines</h2>
              <p>Pain medicines can differ in their ingredients, strength, uses, and potential side effects. Always check the product information and follow the directions provided by your healthcare professional.</p>
            </div>
            <div className="cat-safety-faq">
              <FaqAccordion items={painkillersFaqs} />
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={{ ...painkillersSchema, '@graph': [...painkillersSchema['@graph'], painkillersItemList, painkillersFaqSchema] }} />
    </>
  )
}
