import * as dotenv from 'dotenv'
import path from 'path'
import util from 'util'
import mkdirp from 'mkdirp'
import rimraf from 'rimraf'
import { docProcessor } from '../../src/docProcessor/docProcessor'
import { configFileReader } from '../../src/docProcessor/configFileReader'
dotenv.config()

const rm = util.promisify(rimraf)

const username = process.env.CONFLUENCE_USER ?? ''
const password = process.env.CONFLUENCE_PASSWORD ?? ''

const VOLATILE = path.join(
  __dirname,
  '..',
  'volatile',
  'docProcessor',
  'docProcessorManual'
) // YES, twice the same name

const FIXTURES = path.join(
  __dirname,
  '..',
  'fixtures',
  'docProcessor',
  'docProcessor',
  'doc'
)

beforeAll(async () => {
  await rm(VOLATILE)
  await mkdirp(VOLATILE)
})

test.skip('ONLY FOR DEV: Executes a real requests to the real Confluence', async () => {
  const configFile = path.join(FIXTURES, 'publishDocConfig.json')
  const documentationConfig = await configFileReader(configFile)

  await docProcessor({
    username,
    password,
    target: 'dev',
    buildDir: VOLATILE,
    documentationConfig
  })
})
