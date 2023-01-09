import fs from 'fs'
import path from 'path'
import util from 'util'
import mkdirp from 'mkdirp'
import rimraf from 'rimraf'
import { convertToMarkdown } from '../../src/convert/convertToMarkdown'

const rm = util.promisify(rimraf)

const VOLATILE = path.join(
  __dirname,
  '..',
  'volatile',
  'convert',
  'convertToMarkdown'
)
const FIXTURES = path.join(__dirname, '..', 'fixtures', 'doc')

beforeAll(async () => {
  await rm(VOLATILE)
  await mkdirp(VOLATILE)
})

test('should create the markdown file and copies all the resources', async () => {
  await convertToMarkdown({
    fileName: path.join(FIXTURES, 'index.adoc'),
    imagesDir: FIXTURES,
    targetDir: VOLATILE,
    targetFileName: 'Gumbo'
  })

  // read all the files in Volatile
  const filesDirect = await fs.promises.readdir(VOLATILE)
  const imagesDir = await fs.promises.readdir(path.join(VOLATILE, 'images'))

  expect(filesDirect).toEqual([
    'CIL_CONVERTER_0b1cca5ed879a5c1e4377281a8121027.svg',
    'CIL_CONVERTER_e56160178c1f1eac2b5b74f27bf734a9.svg',
    'CIL_CONVERTER_eb6838eb65fa78b617a11bfbbf7b03ed.png',
    'Gumbo.md',
    'Gumbo.xml',
    'images'
  ])
  expect(imagesDir).toEqual(['aToB.svg', 'screenshot.png', 'subDir'])
})
