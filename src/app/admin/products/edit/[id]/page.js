'use client'

import { useParams } from 'next/navigation'
import AdminProductForm from '../../../_components/ProductForm'

export default function EditProduct() {
  const { id } = useParams()
  return <AdminProductForm productId={id} />
}
