import Link from 'next/link'

export default function InfoSection({
  image,
  imageAlt,
  tag,
  title,
  content,
  bullets = [],
  cta,
  reverse = false,
  className = '',
}) {
  return (
    <div className={`info-sec padding-rl float-left w-100 ${className}`}>
      <section className="float-left w-100 info-sec-inner br-30">
        <div className="main-container">
          <div className={`row align-items-center${reverse ? ' info-sec-reverse' : ''}`}>
            <div className="col-lg-6 col-md-6">
              <div className="info-sec-img">
                <img src={image} alt={imageAlt} className="img-fluid br-30" />
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="info-sec-content">
                {tag && <span className="info-sec-tag">{tag}</span>}
                <h2 className="mb-0">{title}</h2>
                {content && <p className="mb-0">{content}</p>}
                {bullets.length > 0 && (
                  <ul className="info-sec-list list-unstyled p-0 mb-0">
                    {bullets.map((b, i) => (
                      <li key={i}><i className="fa-solid fa-circle-check" /> {b}</li>
                    ))}
                  </ul>
                )}
                {cta && <Link href={cta.href} className="text-decoration-none primary_btn d-inline-block">{cta.label}</Link>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
