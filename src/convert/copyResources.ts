import path from 'path'
import { copyFile } from 'node:fs/promises'
import mkdirp from 'mkdirp'

interface CopyResourcesRequest {
  /** An array with the filenames of the used resources. Relative to the resource directory */
  resources: string[]

  /** The resource directory */
  resourceDir: string

  /** The target directory where to copy the files */
  targetDir: string
}

/**
 * Copies all the resources (images) linked in the document to the new
 * location of the converted file
 * @param request - The parameters as defined in @see CopyResourcesRequest
 */
export async function copyResources(
  request: CopyResourcesRequest
): Promise<void> {
  const { resources, resourceDir, targetDir } = request

  for (const resource of resources) {
    const sourceFile = path.join(resourceDir, resource)
    const targetFile = path.join(targetDir, resource)
    await mkdirp(path.dirname(targetFile))
    await copyFile(sourceFile, targetFile)
  }
}
