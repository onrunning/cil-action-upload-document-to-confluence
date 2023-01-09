import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { IMAGE_NAME_PREFIX } from '../docProcessor/constants'

/** Stores for each file name the resulting hash name. */
export interface ImageNameMap {
  [key: string]: string
}

interface RenameImagesRequest {
  /** All the names of the images relative to baseDir */
  imageNames: string[]

  /** The base Directory which contains all the images with its imagesDir */
  baseDir: string
}

/**
 * Renames the images in a name which is the hash of the image. This reduces the
 * amaount of images to be transferred to confluence. Also it is stable about renaming
 * images.
 * @param imageNames - An Array with all the full qulified image names
 * @returns nameMap - The map with the mapping from old name to new name
 */
export async function renameImages(
  request: RenameImagesRequest
): Promise<ImageNameMap> {
  const { imageNames, baseDir } = request
  const nameMap: { [key: string]: string } = {}

  for (const imageName of imageNames) {
    const imageFile = path.join(baseDir, imageName)
    const image = await fs.promises.readFile(imageFile)
    const hash = crypto.createHash('md5').update(image).digest('hex')

    const extention = path.extname(imageFile)
    const targetName = `${IMAGE_NAME_PREFIX}${hash}${extention}`
    const targetFile = path.join(baseDir, targetName)

    // copy the file to its new name
    await fs.promises.copyFile(imageFile, targetFile)

    // Store the file in the nameMap
    nameMap[imageName] = targetName
  }

  return nameMap
}
