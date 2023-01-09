// @ts-expect-error "can't find a reason for the error"
import nodePandoc from 'node-pandoc'

interface CreatePandocRequest {
  /** The full qualified filename of the source docBook file */
  sourceFile: string

  /** The full qualified filename of the target markdown file */
  targetFile: string
}

/**
 * Calls the native pandoc to convert a docbook xml in a markdoen file
 * @param request - The request as defined in @see CreatePandocRequest
 * @returns Promise<void>
 */
export async function createMarkdown(
  request: CreatePandocRequest
): Promise<void> {
  const { sourceFile, targetFile } = request
  const args = `-f docbook -t jira -o ${targetFile}`

  return await new Promise((resolve, reject) => {
    nodePandoc(sourceFile, args, (err: Error | null | undefined) => {
      if (err !== undefined && err !== null) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
