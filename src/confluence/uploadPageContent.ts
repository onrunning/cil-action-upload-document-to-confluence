import axios from 'axios'
import { CONFLUENCE_BASE_URL } from './constants'

/** The Parameter for this function */
interface UploadPageContentRequest {
  /** The user to connect to confluence */
  username: string

  /** The password for the user */
  password: string

  /** The ID of the page to be loaded */
  pageId: string

  /** The page content to be uploaded. in our case the markdown as string */
  content: string

  /** The page title */
  title: string

  /** The new version number for the new content */
  version: number
}

/**
 * Loads the metadata of a page and returns the title and the current version.
 * @param request - The parameters as described in @see UploadPageContentRequest
 * @returns
 */
export async function uploadPageContent(
  request: UploadPageContentRequest
): Promise<void> {
  const { username, password, pageId, content, title, version } = request

  const url = `/content/${pageId}`
  const data = {
    version: {
      number: version
    },
    id: pageId,
    type: 'page',
    status: 'current',
    title,
    body: {
      storage: {
        value: content,
        representation: 'wiki'
      }
    }
  }

  await axios.put(url, data, {
    baseURL: CONFLUENCE_BASE_URL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    auth: {
      username,
      password
    }
  })
}
