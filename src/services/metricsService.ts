import { api } from '@services/api'

type CountProductViewsInTheLastSevenDaysParams = {
  id: string
}

type CountProductViewsInTheLastSevenDaysResponse = {
  amount: number
}

export async function countProductViewsInTheLastSevenDays({
  id,
}: CountProductViewsInTheLastSevenDaysParams) {
  const response = await api.get<CountProductViewsInTheLastSevenDaysResponse>(
    `/products/${id}/metrics/views`,
  )

  return response.data
}
