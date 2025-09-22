import { AttachmentDTO } from '@dtos/AttachmentDTO'

export type SellerDTO = {
  id: string
  name: string
  phone: string
  email: string
  avatar: AttachmentDTO
}
