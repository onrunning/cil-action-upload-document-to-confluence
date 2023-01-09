import fs from 'fs'
import path from 'path'
import util from 'util'
import mkdirp from 'mkdirp'
import rimraf from 'rimraf'
import { createDocbook } from '../../src/convert/createDocbook'

const rm = util.promisify(rimraf)

const VOLATILE = path.join(
  __dirname,
  '..',
  'volatile',
  'convert',
  'createDocbook'
)
const FIXTURES = path.join(__dirname, '..', 'fixtures', 'doc')
const FIXTURES_EXPECTED = path.join(
  __dirname,
  '..',
  'fixtures',
  'convert',
  'createDocbook'
)

beforeAll(async () => {
  await rm(VOLATILE)
  await mkdirp(VOLATILE)
})

test('should create a docbook file', async () => {
  const imageNames = await createDocbook({
    sourceFileName: path.join(FIXTURES, 'doc_images', 'index.adoc'),

    /** The directory where to store the xml file */
    targetDir: VOLATILE,

    /** The name of the target file relative to targetDir */
    targetFileName: 'createDocbook.xml'
  })

  // open the created file
  const actualFile = path.join(VOLATILE, 'createDocbook.xml')
  let actual = await fs.promises.readFile(actualFile, 'utf8')
  // The data depends on the date the file was created
  // This changes with every git clone
  actual = actual.replace(/<date>.*?<\/date>/, '')

  // open the expected file
  const expectedFile = path.join(FIXTURES_EXPECTED, 'createDocbook.xml')
  let expected = await fs.promises.readFile(expectedFile, 'utf8')
  expected = expected.replace(/<date>.*?<\/date>/, '')

  expect(imageNames).toEqual(['aToB.svg', 'subDir/bigger.svg'])
  expect(actual).toEqual(expected)
})
