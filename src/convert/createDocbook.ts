import path from 'path'
import Processor, { Asciidoctor } from 'asciidoctor'
import docbookConverter from '@asciidoctor/docbook-converter'

// Creates the processor and registers the docbook converter
const processor = Processor()
docbookConverter.register()

/** Defines the request for the convert function */
interface CreateDocbookRequest {
  /** The full qualified filename of the asciidoctor file to be converted into docbook */
  sourceFileName: string

  /** The directory where to store the xml file */
  targetDir: string

  /** The name of the target file relative to targetDir */
  targetFileName?: string
}

/**
 * Converts a asciidoctor file into a docbook5 xml file.
 * @param request - The parameters ad defined in @see createDocbookRequest
 * @returns An array of image names included in the file
 */
export function createDocbook(request: CreateDocbookRequest): string[] {
  const { sourceFileName, targetDir, targetFileName } = request

  const doc = processor.convertFile(sourceFileName, {
    standalone: true,
    backend: 'docbook5',
    catalog_assets: true,
    doctype: 'book',
    mkdirs: true,
    to_dir: targetDir,
    safe: 'unsafe',
    to_file: targetFileName
  })

  // extract the referenced images
  const images: Asciidoctor.Document.ImageReference[] = (
    doc as Asciidoctor.Document
  ).getImages()

  const imageNames: string[] = []
  let imagesDirectory = ''
  for (const imageObj of images) {
    if (imagesDirectory === '') {
      imagesDirectory = imageObj.getImagesDirectory() ?? ''
    }
    imageNames.push(path.join(imagesDirectory, imageObj.getTarget()))
  }
  return imageNames
}
