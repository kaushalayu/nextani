import { generatePageMetadata } from '../../lib/seo-metadata'

export const metadata = generatePageMetadata(
  'About Us',
  'Learn more about Pharmez - your trusted online pharmacy. We provide fast and reliable medicine delivery with certified pharmacists.',
  '/about'
)

export default function About() {
  return (
    <div className="about-page">
      <div className="container" style={{ padding: '60px 0' }}>
        <h1>About Pharmez</h1>
        <p>Your trusted online pharmacy offering fast and reliable medicine delivery.</p>
      </div>
    </div>
  )
}
