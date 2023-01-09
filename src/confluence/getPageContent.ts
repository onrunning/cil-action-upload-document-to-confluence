import axios from 'axios'
import { CONFLUENCE_BASE_URL } from './constants'

/** The Parameter for this function */
interface GetPageContentRequest {
  /** The user to connect to confluence */
  username: string

  /** The password for the user */
  password: string

  /** The ID of the page to be loaded */
  pageId: string
}

/** The response of this function */
interface GetPageContentResponse {
  /** The title of the page */
  title: string

  /** The current version number. When updating the page the number must be increased */
  version: number
}

/**
 * Loads the metadata of a page and returns the title and the current version.
 * @param request - The parameters as described in @see GetPageContentRequest
 * @returns
 */
export async function getPageContent(
  request: GetPageContentRequest
): Promise<GetPageContentResponse> {
  const { username, password, pageId } = request

  const url = `/content/${pageId}`

  const response = await axios.get(url, {
    method: 'get',
    baseURL: CONFLUENCE_BASE_URL,
    headers: { Accept: 'application/json' },
    auth: {
      username,
      password
    }
  })

  const title = response.data.title
  const version: number = response.data.version.number

  return { title, version }
}
