import fs from 'fs'
import { ImageNameMap } from './renameImages'

interface RenameImagesInMarkdownRequest {
  /** The name of the markdown file */
  fileName: string

  /** A mapping of the old filename to the new one */
  imageNameMap: ImageNameMap
}

/**
 * Does all the cleanup needed to be published to confluence
 * @param request - The request as described in @see RenameImagesInMarkdownRequest
 */
export async function renameImagesInMarkdown(
  request: RenameImagesInMarkdownRequest
): Promise<void> {
  const { fileName, imageNameMap } = request
  let fileContentString = await fs.promises.readFile(fileName, 'utf8')

  for (const oldName of Object.keys(imageNameMap)) {
    const newName = imageNameMap[oldName]
    const from = `!${oldName}|`
    const to = `!${newName}|`
    fileContentString = fileContentString.replaceAll(from, to)
  }

  await fs.promises.writeFile(fileName, fileContentString, 'utf8')
}
