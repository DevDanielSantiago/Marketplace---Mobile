import { SellerDTO } from '@dtos/SellerDTO'
import { api } from '@services/api'

type CreateSellerBody = {
  email: string
  name: string
  phone: string
  password: string
  passwordConfirmation: string
  avatarId?: string | null
}

type CreateSellerResponse = {
  seller: SellerDTO
}

export async function createSeller(body: CreateSellerBody) {
  const response = await api.post<CreateSellerResponse>('/sellers', body)
  return response.data
}

type GetSellerProfileResponse = {
  seller: SellerDTO
}

export async function getSellerProfile() {
  const response = await api.get<GetSellerProfileResponse>('/sellers/me')
  return response.data
}

type UpdateCurrentSellerBody = {
  email: string
  name: string
  phone: string
  password?: string | null
  newPassword?: string | null
  avatarId?: string | null
}

type UpdateCurrentSellerResponse = {
  seller: SellerDTO
}

export async function updateCurrentSeller(body: UpdateCurrentSellerBody) {
  const response = await api.put<UpdateCurrentSellerResponse>('/sellers', body)
  return response.data
}
