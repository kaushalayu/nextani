import Link from 'next/link'

export const metadata = {
  title: '404 - Page Not Found | Pharmez',
  description: 'The page you are looking for does not exist.',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <section className="error-section w-100 float-left position-relative bg-lavendr">
      <div className="container">
        <div className="row">
          <div className="col-xl-8 col-lg-10 col-12 mr-auto ml-auto">
            <div className="error-con text-center not-found-content">
              <h2 className="not-found-code">404</h2>
              <h4 className="font-weight-700 not-found-title">Page Not Found</h4>
              <p className="not-found-desc">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
              </p>
              <Link href="/" className="not-found-btn">Back to Homepage</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
