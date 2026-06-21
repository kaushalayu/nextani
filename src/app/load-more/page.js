'use client'

import { useState, useEffect } from 'react'
import API from '../../lib/api'
import ProductCard from '../../components/ProductCard'

export default function LoadMore() {
  return (
    <div className="page-container" style={{ padding: '40px 0' }}>
      <div className="container">
        <h1>Load More</h1>
        <p>Browse our complete collection.</p>
      </div>
    </div>
  )
}
