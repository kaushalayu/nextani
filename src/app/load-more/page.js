'use client'

import { useState, useEffect } from 'react'
import API from '../../lib/api'
import ProductCard from '../../components/ProductCard'
import SubBanner from '../../components/SubBanner'

export default function LoadMore() {
  return (
    <>
      <SubBanner title="Shop All Products" description="Browse all our products with load more functionality." page="Shop" />
      <div className="cat-page">
      <div className="container">
        <h1>Load More</h1>
        <p>Browse our complete collection.</p>
      </div>
    </div>
    </>
  )
}
