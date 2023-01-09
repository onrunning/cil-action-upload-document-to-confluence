import fs from 'fs'
import path from 'path'
import util from 'util'
import mkdirp from 'mkdirp'
import rimraf from 'rimraf'
import { renameImages } from '../../src/convert/renameImages'

const rm = util.promisify(rimraf)

const VOLATILE = path.join(
  __dirname,
  '..',
  'volatile',
  'convert',
  'renameImages'
)
const FIXTURES = path.join(
  __dirname,
  '..',
  'fixtures',
  'convert',
  'renameImages'
)

beforeAll(async () => {
  await rm(VOLATILE)
  await mkdirp(VOLATILE)
})

test('should rename the images and return a nameMap', async () => {
  const nameList = [
    'images/aToB.svg',
    'images/aToBCopy.svg',
    'images/bigger.svg',
    'images/screenshot.png',
    'images/screenshotCopy.png'
  ]

  const imageNames: string[] = []
  for (const name of nameList) {
    const src = path.join(FIXTURES, name)
    const target = path.join(VOLATILE, name)
    await mkdirp(path.dirname(target))
    await fs.promises.copyFile(src, target)
    imageNames.push(name)
  }

  const nameMap = await renameImages({ imageNames, baseDir: VOLATILE })
  //   const newMap = nameMap.map()

  expect(nameMap).toEqual({
    'images/aToB.svg': 'CIL_CONVERTER_e56160178c1f1eac2b5b74f27bf734a9.svg',
    'images/aToBCopy.svg': 'CIL_CONVERTER_e56160178c1f1eac2b5b74f27bf734a9.svg',
    'images/bigger.svg': 'CIL_CONVERTER_0b1cca5ed879a5c1e4377281a8121027.svg',
    'images/screenshot.png':
      'CIL_CONVERTER_eb6838eb65fa78b617a11bfbbf7b03ed.png',
    'images/screenshotCopy.png':
      'CIL_CONVERTER_eb6838eb65fa78b617a11bfbbf7b03ed.png'
  })
})
