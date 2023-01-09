import fs from 'fs'
import path from 'path'
import axios from 'axios'
import FormData from 'form-data'
import { CONFLUENCE_BASE_URL } from './constants'

/** The Parameter for this function */
interface UploadPageAttachmentRequest {
  /** The user to connect to confluence */
  username: string

  /** The password for the user */
  password: string

  /** The ID of the page to be loaded */
  pageId: string

  /** A list of files to be uploaded */
  files: string[]
}

/**
 * Uploads a list of new attachment to confluence
 * @param request - The parameters as described in @see UploadPageAttachmentRequest
 * @returns
 */
export async function uploadPageAttachments(
  request: UploadPageAttachmentRequest
): Promise<void> {
  const { username, password, pageId, files } = request

  const url = `/content/${pageId}/child/attachment`
  const formData = await loadFiles(files)

  await axios.post(url, formData, {
    baseURL: CONFLUENCE_BASE_URL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      'X-Atlassian-Token': 'nocheck'
    },
    auth: {
      username,
      password
    }
  })
}

/**
 * Loads the files and returns an object where the Buffer data is stored by the filename.
 * ```json
 * {
 *   myFileName: "<buffer data of file>"
 * }
 * ```
 * @param files - The list of files to be loaded
 */
async function loadFiles(files: string[]): Promise<FormData> {
  const form = new FormData()

  for (const file of files) {
    // In confluence the file is without the path
    const name = path.basename(file)
    const data = await fs.promises.readFile(file)
    form.append('file', data, name)
  }

  return form
}
