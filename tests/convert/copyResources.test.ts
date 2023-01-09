import fs from 'fs'
import path from 'path'
import util from 'util'
import mkdirp from 'mkdirp'
import rimraf from 'rimraf'
import { copyResources } from '../../src/convert/copyResources'

const rm = util.promisify(rimraf)

const VOLATILE = path.join(
  __dirname,
  '..',
  'volatile',
  'convert',
  'copyResources'
)
const FIXTURES = path.join(
  __dirname,
  '..',
  'fixtures',
  'convert',
  'copyResources'
)

beforeAll(async () => {
  await rm(VOLATILE)
  await mkdirp(VOLATILE)
})

test('should copy all the resources', async () => {
  await copyResources({
    resources: ['aToB.svg', 'screenshot.png', 'subDir/bigger.svg'],
    resourceDir: path.join(FIXTURES, 'images'),
    targetDir: VOLATILE
  })

  // read all the files in Volatile
  const filesDirect = await fs.promises.readdir(VOLATILE)
  const filesSubDir = await fs.promises.readdir(path.join(VOLATILE, 'subDir'))

  expect(filesDirect).toEqual(['aToB.svg', 'screenshot.png', 'subDir'])
  expect(filesSubDir).toEqual(['bigger.svg'])
})
