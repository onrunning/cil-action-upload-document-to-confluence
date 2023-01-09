import fs from 'fs'
import { DocumentationConfigElement } from './schema/configFileInterface'
import { configFileValidator } from './schema/configFileValidator'

/**
 * This function reads the config file and validates it against
 * a json schema definition.
 * If the file is valid it returns the config object
 * @param fileName - The name and path of the configfile
 * @returns - The DocumentationConfig object
 */
export async function configFileReader(
  fileName: string
): Promise<DocumentationConfigElement[]> {
  // eslint-disable-next-line no-console
  console.log(`Use config file '${fileName}'`)
  const fileContentText = await fs.promises.readFile(fileName, 'utf8')
  const fileContentJson = JSON.parse(fileContentText)

  return configFileValidator({ config: fileContentJson })
}
