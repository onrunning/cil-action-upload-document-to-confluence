import path from 'path'
import { copyResources } from './copyResources'
import { createDocbook } from './createDocbook'
import { createMarkdown } from './createMarkdown'
import { renameImages } from './renameImages'

interface ConvertToMarkdownRequest {
  /** The file name of the entry asciidoc file */
  fileName: string

  /** The directory containing all the images */
  imagesDir: string

  /** The directory where to store the created markdown file */
  targetDir: string

  /** The name of the mardown file relative to targetDir WITHOUT extention */
  targetFileName: string
}

/**
 * Converts the asciidoctor file into docbook and then into markdown.
 * Also it will copy over all the referenced resources
 * @param request - The parameters as defined in @see ConvertToMarkdownRequest
 */
export async function convertToMarkdown(
  request: ConvertToMarkdownRequest
): Promise<void> {
  const { fileName, imagesDir, targetDir, targetFileName } = request

  const docbookFileName = `${targetFileName}.xml`
  const markdownFileName = `${targetFileName}.md`

  const imageNames = createDocbook({
    sourceFileName: fileName,
    targetDir,
    targetFileName: docbookFileName
  })

  await createMarkdown({
    /** The full qualified filename of the source docBook file */
    sourceFile: path.join(targetDir, docbookFileName),

    /** The full qualified filename of the target markdown file */
    targetFile: path.join(targetDir, markdownFileName)
  })

  await copyResources({
    resources: imageNames,
    resourceDir: imagesDir,
    targetDir
  })

  await renameImages({ imageNames, baseDir: targetDir })
}
