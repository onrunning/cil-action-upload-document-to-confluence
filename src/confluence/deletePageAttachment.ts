import axios from 'axios'
import { CONFLUENCE_BASE_URL } from './constants'

/** The Parameter for this function */
interface DeletePageAttachmentRequest {
  /** The user to connect to confluence */
  username: string

  /** The password for the user */
  password: string

  /** A list of attachments Ids to be deleted */
  attachmentId: string
}

/**
 * Deletes a attachement given by the attachment id from confluence
 * @param request - The parameters as described in @see DeletePageAttachmentRequest
 * @returns
 */
export async function deletePageAttachment(
  request: DeletePageAttachmentRequest
): Promise<void> {
  const { username, password, attachmentId } = request

  const urlTrash = `/content/${attachmentId}?status=current`
  const urlPurge = `/content/${attachmentId}?status=trashed`

  for (const url of [urlTrash, urlPurge]) {
    await axios.delete(url, {
      baseURL: CONFLUENCE_BASE_URL,
      headers: {
        Accept: 'application/json'
      },
      auth: {
        username,
        password
      }
    })
  }
}
