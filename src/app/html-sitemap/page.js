import Link from 'next/link'

const sections = [
  {
    title: 'Main Pages',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Shop Medicines', href: '/shop' },
      { label: 'All Medicines (A–Z)', href: '/all-medicines' },
      { label: 'About Us', href: '/about' },
      { label: 'Our Services', href: '/services' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Medicines by Category',
    links: [
      { label: 'Sleeping Pills', href: '/sleeping-pills' },
      { label: 'Painkillers', href: '/painkillers' },
      { label: 'Anxiety Pills', href: '/anxiety' },
      { label: 'Best Sellers', href: '/best-sellers' },
      { label: 'New Arrivals', href: '/new-arrivals' },
    ],
  },
  {
    title: 'Information',
    links: [
      { label: 'Blog & Articles', href: '/blog' },
      { label: 'Testimonials', href: '/testimonials' },
      { label: 'FAQ', href: '/faq' },
      { label: 'My Account', href: '/profile' },
      { label: 'Login', href: '/login' },
      { label: 'Wishlist', href: '/wishlist' },
      { label: 'Shopping Cart', href: '/cart' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Use', href: '/terms-of-use' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
    ],
  },
]

export const metadata = {
  title: 'HTML Sitemap',
  description: 'Complete sitemap of all pages on Painomed.us — browse every page of our online pharmacy.',
}

export default function HtmlSitemapPage() {
  return (
    <>
      <div className="html-sitemap-page padding-top padding-bottom">
        <div className="container">
          <h1>HTML Sitemap</h1>
          <p className="html-sitemap-intro">
            Browse all pages available on Painomed.us. If you are looking for a specific medicine,
            head to the <Link href="/all-medicines">All Medicines</Link> page or use the search bar.
          </p>
          {sections.map((section) => (
            <div className="html-sitemap-section" key={section.title}>
              <h2>{section.title}</h2>
              <ul>
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
