import { generatePageMetadata } from '../../lib/seo-metadata'
import SubBanner from '../../components/SubBanner'

export const metadata = generatePageMetadata('Privacy Policy', 'Pharmez privacy policy outlines how we collect, use, and protect your personal information when using our online pharmacy services.', '/privacy-policy')

export default function PrivacyPolicy() {
  return (
    <>
      <SubBanner title="Privacy Policy" description="Pharmez privacy policy outlines how we collect, use, and protect your personal information when using our online pharmacy services." page="Privacy Policy" />
      <div className="padding-rl float-left w-100">
        <div className="container legal-content">
          <h2>Introduction</h2>
          <p>Pharmez (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>
          <h2>Information We Collect</h2>
          <p>We may collect personal information such as your name, email address, phone number, shipping address, and payment details when you place an order or interact with our site.</p>
          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to process orders, provide customer support, improve our services, and send relevant updates with your consent.</p>
          <h2>Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>
          <h2>Third-Party Disclosure</h2>
          <p>We do not sell, trade, or transfer your personal information to third parties without your consent, except as required by law or as necessary to provide our services.</p>
          <h2>Cookies</h2>
          <p>Our website may use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings.</p>
          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at support@pharmez.com.</p>
        </div>
      </div>
    </>
  )
}
