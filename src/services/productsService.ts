import { ProductDTO } from '@dtos/ProductDTO'
import { api } from '@services/api'

type GetProductByIdParams = {
  id: string
}

type GetProductByIdResponse = {
  product: ProductDTO
}

export async function getProductById({ id }: GetProductByIdParams) {
  const response = await api.get<GetProductByIdResponse>(`/products/${id}`)
  return response.data
}

type ListAllProductsResponse = {
  products: ProductDTO[]
}

export async function listAllProducts() {
  const response = await api.get<ListAllProductsResponse>('/products')
  return response.data
}
