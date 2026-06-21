import { useState, useEffect, useCallback, useMemo } from 'react'
import API from '../lib/api'

export function useProducts(params = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)

  const paramKey = useMemo(() => JSON.stringify(params), [params])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const query = new URLSearchParams()
      const parsed = JSON.parse(paramKey)
      Object.entries(parsed).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') query.append(k, v)
      })
      const { data } = await API.get(`/products?${query}`)
      setProducts(data.products)
      setTotal(data.total)
      setPages(data.pages)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [paramKey])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  return { products, loading, error, total, pages, refetch: fetchProducts }
}

export function useSingleProduct(idOrSlug) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!idOrSlug) return
    setLoading(true)
    setError(null)
    API.get(`/products/${idOrSlug}`)
      .then(({ data }) => setProduct(data.product))
      .catch((err) => setError(err.response?.data?.message || 'Product not found'))
      .finally(() => setLoading(false))
  }, [idOrSlug])

  return { product, loading, error }
}
