import { CategoryDTO } from '@dtos/CategoryDTO'
import { api } from '@services/api'

type ListAllCategoriesResponse = {
  categories: CategoryDTO[]
}

export async function listAllCategories() {
  const response = await api.get<ListAllCategoriesResponse>('/categories')
  return response.data
}
