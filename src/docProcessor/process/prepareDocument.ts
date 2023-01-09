import path from 'path'
import { copyResources } from '../../convert/copyResources'
import { createDocbook } from '../../convert/createDocbook'
import { createMarkdown } from '../../convert/createMarkdown'
import { renameImages } from '../../convert/renameImages'
import { renameImagesInMarkdown } from '../../convert/renameImagesInMarkdown'

interface PrepareDocumentRequest {
  /** The target for publishing the documentation */
  target: 'dev' | 'uat' | 'prd'

  /** The directory where to build the documentation */
  buildDir: string

  /** The pageId in confluence where to store the file */
  pageId: string

  /** The file name from the configuration */
  sourceFileName: string
}

interface PrepareDocumentResult {
  /** The file name of the mardown file */
  fileNameMarkdown: string

  /** A unique list of image file names to be uploaded */
  imagesToUpload: string[]
}

/**
 * Converts the asciidoc document in markdown. Then renames the images files.
 * And updates the links in the markdown document
 * @param request - The parameters as described in @see PrepareDocumentRequest
 * @returns imagesNameMap
 */
export async function prepareDocument(
  request: PrepareDocumentRequest
): Promise<PrepareDocumentResult> {
  const { target, buildDir, pageId, sourceFileName } = request

  // The build directory for this document in this stage
  const targetDir = path.join(buildDir, target, pageId)

  // The name of the genrated docbook file
  const fileNameDocbook = path.join(targetDir, 'docbook.xml')
  const fileNameMarkdown = path.join(targetDir, 'markdown.md')

  // eslint-disable-next-line no-console
  console.log(`Create docBook file '${fileNameDocbook}'`)
  // convert asciidoc to docbook
  const imageFiles = createDocbook({
    sourceFileName,
    targetDir,
    targetFileName: path.basename(fileNameDocbook)
  })

  // eslint-disable-next-line no-console
  console.log(`Create markdown file '${fileNameMarkdown}'`)
  // convert docbook to markdown
  await createMarkdown({
    sourceFile: fileNameDocbook,
    targetFile: fileNameMarkdown
  })

  // eslint-disable-next-line no-console
  console.log('Copy resources')
  // copies the images from the asciidoctor images directory into the build directory of this document
  await copyResources({
    resources: imageFiles,
    resourceDir: path.dirname(sourceFileName),
    targetDir
  })

  // eslint-disable-next-line no-console
  console.log('Rename images')

  // rename the images into names like 'CIL_CONVERTER__<hashValue>.<ext>'
  const imageNameMap = await renameImages({
    baseDir: targetDir,
    imageNames: imageFiles
  })

  // eslint-disable-next-line no-console
  console.log('Replace image names in markdown file')

  // Replace the old image references with the new ones
  await renameImagesInMarkdown({ fileName: fileNameMarkdown, imageNameMap })

  // A unique list of images to be uploaded for the page
  const imagesToUpload: string[] = Array.from(
    new Set(Object.values(imageNameMap))
  ).map((e) => {
    return path.join(targetDir, e)
  })

  return { fileNameMarkdown, imagesToUpload }
}
