import { AttachmentDTO } from '@dtos/AttachmentDTO'
import { CategoryDTO } from '@dtos/CategoryDTO'
import { SellerDTO } from '@dtos/SellerDTO'

export type ProductDTO = {
  id: string
  title: string
  description: string
  priceInCents: number
  status: string
  owner: SellerDTO
  category: CategoryDTO
  attachments: AttachmentDTO[]
}
