import path from 'path'
import { configFileReader } from '../../src/docProcessor/configFileReader'

const FIXTURES = path.join(
  __dirname,
  '..',
  'fixtures',
  'docProcessor',
  'configFileReader'
)

const expectedConfig = [
  {
    fileName: 'doc/index.adoc',
    dev: {
      pageId: '0815'
    },
    prd: {
      pageId: '4711'
    }
  },
  {
    fileName: 'doc/doc_images/index.adoc',
    prd: {
      pageId: '1234'
    }
  },
  {
    fileName: 'doc/doc_other/index.adoc',
    prd: {
      pageId: '1235'
    }
  },
  {
    fileName: 'doc/doc_tables/index.adoc',
    prd: {
      pageId: '1236'
    }
  }
]

test('Should read the config and returns it', async () => {
  const configFile = path.join(FIXTURES, 'publishDocConfig.json')
  const config = await configFileReader(configFile)
  expect(config).toEqual(expectedConfig)
})
