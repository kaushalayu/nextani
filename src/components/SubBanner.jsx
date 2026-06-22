import Link from 'next/link'

export default function SubBanner({ title, description, page }) {
  return (
    <div className="padding-rl float-left w-100">
      <section className="float-left w-100 sub-banner-con position-relative d-flex align-items-center justify-content-center br-30">
        <div className="main-container">
          <div className="col-xl-12 col-lg-12 mr-auto ml-auto">
            <div className="sub-banner-inner-con text-center">
              <h1>{title}</h1>
              <p>{description}</p>
              <div className="breadcrumb-con d-inline-block">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">{page}</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
