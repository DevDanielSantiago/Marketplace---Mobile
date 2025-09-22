import { AttachmentDTO } from '@dtos/AttachmentDTO'
import { api } from '@services/api'

export interface UploadAttachmentsBody {
  files: FormData
}

interface UploadAttachmentsResponse {
  attachments: AttachmentDTO[]
}

export async function uploadAttachments({
  files,
}: UploadAttachmentsBody): Promise<UploadAttachmentsResponse> {
  const attachments = await api.post('/attachments', files, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return attachments.data
}
