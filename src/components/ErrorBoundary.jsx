'use client'

import { Component } from 'react'
import Link from 'next/link'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="error-section w-100 float-left position-relative bg-lavendr">
          <div className="container">
            <div className="row">
              <div className="col-xl-8 col-lg-10 col-12 mr-auto ml-auto">
                <div className="error-con">
                  <h2>5 <i className="fa-solid fa-face-sad-tear"></i> 5</h2>
                  <h4 className="font-weight-700">Something Went Wrong</h4>
                  <p>An unexpected error occurred. Please try refreshing the page.</p>
                  <Link href="/" className="text-decoration-none primary_btn d-inline-block">
                    Back to Homepage
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
