import axios from 'axios'
import { CONFLUENCE_BASE_URL } from './constants'

/** The Parameter for this function */
interface GetPageAttachmentsRequest {
  /** The user to connect to confluence */
  username: string

  /** The password for the user */
  password: string

  /** The ID of the page to be loaded */
  pageId: string
}

export interface AttachemntInfo {
  /** The name of the Attachment  */
  name: string

  /** The id of the Attachment  */
  id: string
}

/**
 * Downloads all the metadata of the attachments of the page.
 * It will return a list of attachment names
 * @param request - The parameters as described in @see GetPageAttachmentsRequest
 * @returns
 */
export async function getPageAttachments(
  request: GetPageAttachmentsRequest
): Promise<AttachemntInfo[]> {
  const { username, password, pageId } = request

  const url = `/content/${pageId}/child/attachment`

  const response = await axios.get(url, {
    baseURL: CONFLUENCE_BASE_URL,
    headers: { Accept: 'application/json' },
    auth: {
      username,
      password
    }
  })

  const results: any[] = response.data.results

  const attachmentInfo: AttachemntInfo[] = []
  for (const result of results) {
    attachmentInfo.push({ name: result.title, id: result.id })
  }

  return attachmentInfo
}
