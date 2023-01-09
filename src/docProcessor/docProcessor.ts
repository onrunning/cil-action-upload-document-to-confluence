import { AxiosError } from 'axios'
import { prepareDocument } from './process/prepareDocument'
import { uploadToConfluence } from './process/uploadToConfluence'
import { DocumentationConfigElement } from './schema/configFileInterface'

interface DocProcessorRequest {
  /** The user to connect to confluence */
  username: string

  /** The password for the user */
  password: string

  /** The target for publishing the documentation */
  target: 'dev' | 'uat' | 'prd'

  /** The directory where to build the documentation */
  buildDir: string

  /** The configuration for the documentation */
  documentationConfig: DocumentationConfigElement[]
}

export async function docProcessor(
  request: DocProcessorRequest
): Promise<void> {
  const { documentationConfig, target, buildDir, username, password } = request
  for (const configElement of documentationConfig) {
    try {
      if (configElement[target] === undefined) {
        throw new Error(
          `The configuration does not contain the target '${target}'`
        )
      }

      const pageId = configElement[target]?.pageId
      const sourceFileName = configElement.fileName

      // eslint-disable-next-line no-console
      console.log(`Work on target '${target} for the file '${sourceFileName}'`)

      if (pageId !== undefined) {
        const { fileNameMarkdown, imagesToUpload } = await prepareDocument({
          target,
          buildDir,
          pageId,
          sourceFileName
        })

        await uploadToConfluence({
          username,
          password,
          fileName: fileNameMarkdown,
          images: imagesToUpload,
          pageId
        })
      }
    } catch (error) {
      console.log('---------- ERROR ------------') // eslint-disable-line no-console
      if (error instanceof AxiosError) {
        console.log(error.response?.data.message) // eslint-disable-line no-console
        console.log(error.response?.data.statusCode) // eslint-disable-line no-console
        console.log(error.stack) // eslint-disable-line no-console
      } else if (error instanceof Error) {
        console.log(error.message) // eslint-disable-line no-console
        console.log(error.stack) // eslint-disable-line no-console
      } else {
        console.log(error) // eslint-disable-line no-console
      }
      throw error
    }
  }
}
