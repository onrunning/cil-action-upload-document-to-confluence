import fs from 'fs'
import path from 'path'
import { deletePageAttachment } from '../../confluence/deletePageAttachment'
import {
  AttachemntInfo,
  getPageAttachments
} from '../../confluence/getPageAttachments'
import { getPageContent } from '../../confluence/getPageContent'
import { uploadPageAttachments } from '../../confluence/uploadPageAttachments'
import { uploadPageContent } from '../../confluence/uploadPageContent'
import { IMAGE_NAME_PREFIX } from '../constants'

interface UploadToConfluenceRequest {
  /** The user to connect to confluence */
  username: string

  /** The password for the user */
  password: string

  /** The ID of the page to be loaded */
  pageId: string

  /** The mardown file to upload */
  fileName: string

  /** The filenames of the images to be uploaded */
  images: string[]
}

/**
 * Handles the interaction with confluence.
 * It will upload the site content and updates the attachments.
 * Upload new images or delete obsolete images from confluence
 * @param request - The request as defined @see UploadToConfluenceRequest
 */
export async function uploadToConfluence(
  request: UploadToConfluenceRequest
): Promise<void> {
  const { username, password, pageId, fileName, images } = request

  // eslint-disable-next-line no-console
  console.log('Get existing page META information')

  // get the version and the title of the current page
  const { title, version } = await getPageContent({
    username,
    password,
    pageId
  })

  // eslint-disable-next-line no-console
  console.log('Get existing attachmants')

  // get all the current existing attachments of the page
  const existingattachmentsInfo = await (
    await getPageAttachments({ username, password, pageId })
  ).filter((element) => {
    if (element.name.startsWith(IMAGE_NAME_PREFIX)) {
      return true
    }
    return false
  })

  // eslint-disable-next-line no-console
  console.log('Upload new page content')

  // Load the markdown file and upload it
  const content = await fs.promises.readFile(fileName, 'utf8')
  await uploadPageContent({
    username,
    password,
    pageId,
    content,
    title,
    version: version + 1
  })

  // get the images to be deleted and the images to be uploaded
  const { imageIdsToDelete, imagesWithPathToUpload } = createImageAction({
    existingImagesInfo: existingattachmentsInfo,
    newImagesWithPath: images
  })

  // eslint-disable-next-line no-console
  console.log(`Upload new Attachments: count=${imagesWithPathToUpload.length}`)

  if (imagesWithPathToUpload.length > 0) {
    // Uploads the new images
    await uploadPageAttachments({
      username,
      password,
      pageId,
      files: imagesWithPathToUpload
    })
  }

  // eslint-disable-next-line no-console
  console.log(`Delete old Attachments: count=${imageIdsToDelete.length}`)

  for (const id of imageIdsToDelete) {
    await deletePageAttachment({
      username,
      password,
      attachmentId: id
    })
  }
}

/** The request parameters */
interface CreateImageActionRequest {
  /** The names (no path) of the existing images. (In confluence the images have no path) */
  existingImagesInfo: AttachemntInfo[]

  /** The new or current image names. The filenames with the path */
  newImagesWithPath: string[]
}

/**
 * Defines the result of the function createImageAction
 */
interface CreateImageActionResult {
  /** The names of the images to be deleted in confluence */
  imageIdsToDelete: string[]

  /** The images with full qualified name to be uploaded */
  imagesWithPathToUpload: string[]
}

/**
 * Computes wich images needs to be uploaded and which needs to be deleted
 * @param request - The parameters as defined in @see CreateImageActionRequest
 * @returns
 */
function createImageAction(
  request: CreateImageActionRequest
): CreateImageActionResult {
  const { existingImagesInfo, newImagesWithPath } = request

  // coverts the image names with full path to a list which only have the name
  const newImages = newImagesWithPath.map((imagePath): string => {
    return path.basename(imagePath)
  })

  // The map is needed to get the ID for th eimage name
  const existingImagesMap: { [key: string]: string } = {}
  existingImagesInfo.map((e) => (existingImagesMap[e.name] = e.id))

  const existingImages = Object.keys(existingImagesMap)
  const existingImagesSet = new Set(existingImages)

  const newImagesSet = new Set(newImages)

  const imageIdsToDelete: string[] = []
  const imagesToUpload: string[] = []
  const imagesWithPathToUpload: string[] = []

  // get all the images names which needs to be uploaded
  for (const name of newImages) {
    if (!existingImagesSet.has(name)) {
      imagesToUpload.push(name)
    }
  }

  // now get all the image names which needs to be deleted
  for (const name of existingImages) {
    if (!newImagesSet.has(name)) {
      imageIdsToDelete.push(existingImagesMap[name])
    }
  }

  // The images which needs to be uploaded needs the complete path, not only the name
  const uploadImageNameSet = new Set(imagesToUpload)
  for (const imageWithPath of newImagesWithPath) {
    if (uploadImageNameSet.has(path.basename(imageWithPath))) {
      imagesWithPathToUpload.push(imageWithPath)
    }
  }

  return { imageIdsToDelete, imagesWithPathToUpload }
}
