import { api } from '@services/api'

type GetSellerAccessTokenBody = {
  email: string
  password: string
}

type GetSellerAccessTokenResponse = {
  accessToken: string
}

export async function getSellerAccessToken({
  email,
  password,
}: GetSellerAccessTokenBody) {
  const response = await api.post<GetSellerAccessTokenResponse>(
    '/sellers/sessions',
    { email, password },
  )

  return response.data
}

export async function signOut() {
  await api.post('/sign-out')
}
