import fs from 'fs'
import path from 'path'
import util from 'util'
import mkdirp from 'mkdirp'
import rimraf from 'rimraf'
import { renameImagesInMarkdown } from '../../src/convert/renameImagesInMarkdown'

const rm = util.promisify(rimraf)

const VOLATILE = path.join(
  __dirname,
  '..',
  'volatile',
  'convert',
  'renameImagesInMarkdown'
)
const FIXTURES = path.join(
  __dirname,
  '..',
  'fixtures',
  'convert',
  'renameImagesInMarkdown'
)

beforeAll(async () => {
  await rm(VOLATILE)
  await mkdirp(VOLATILE)
})

test('should rename the images and stores the file', async () => {
  const fixturesFile = path.join(FIXTURES, 'index.md')
  const expectedFile = path.join(FIXTURES, 'index_expected.md')
  const volatileFile = path.join(VOLATILE, 'index.md')

  await fs.promises.copyFile(fixturesFile, volatileFile)

  await renameImagesInMarkdown({
    fileName: volatileFile,
    imageNameMap: {
      'images/aToB.svg': 'CIL_CONVERTER_e56160178c1f1eac2b5b74f27bf734a9.svg',
      'images/aToBCopy.svg':
        'CIL_CONVERTER_e56160178c1f1eac2b5b74f27bf734a9.svg',
      'images/subDir/bigger.svg':
        'CIL_CONVERTER_0b1cca5ed879a5c1e4377281a8121027.svg'
    }
  })

  const expected = await fs.promises.readFile(expectedFile, 'utf8')
  const actual = await fs.promises.readFile(volatileFile, 'utf8')

  expect(actual).toEqual(expected)
})
