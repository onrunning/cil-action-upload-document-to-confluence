import fs from 'fs'
import path from 'path'
import util from 'util'
import mkdirp from 'mkdirp'
import rimraf from 'rimraf'
import { createMarkdown } from '../../src/convert/createMarkdown'

const rm = util.promisify(rimraf)

const VOLATILE = path.join(
  __dirname,
  '..',
  'volatile',
  'convert',
  'createMarkdown'
)
const FIXTURES = path.join(
  __dirname,
  '..',
  'fixtures',
  'convert',
  'createMarkdown'
)

beforeAll(async () => {
  await rm(VOLATILE)
  await mkdirp(VOLATILE)
})

test('should create a markdown file', async () => {
  await createMarkdown({
    /** The full qualified filename of the source docBook file */
    sourceFile: path.join(FIXTURES, 'docbook.xml'),

    /** The full qualified filename of the target markdown file */
    targetFile: path.join(VOLATILE, 'index.md')
  })

  // open the created file
  const actualFile = path.join(VOLATILE, 'index.md')
  const actual = await fs.promises.readFile(actualFile, 'utf8')

  // open the expected file
  const expectedFile = path.join(FIXTURES, 'index.md')
  const expected = await fs.promises.readFile(expectedFile, 'utf8')

  expect(actual).toEqual(expected)
})
