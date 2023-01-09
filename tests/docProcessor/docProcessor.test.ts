import * as dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import util from 'util'
import mkdirp from 'mkdirp'
import rimraf from 'rimraf'
import { docProcessor } from '../../src/docProcessor/docProcessor'
import axios from 'axios'
import {
  responsePageAttachments,
  responsePageContent,
  responseUpload
} from './mockResponses'
dotenv.config()

const rm = util.promisify(rimraf)

const VOLATILE = path.join(
  __dirname,
  '..',
  'volatile',
  'docProcessor',
  'docProcessor'
) // YES, twice the same name

const FIXTURES = path.join(
  __dirname,
  '..',
  'fixtures',
  'docProcessor',
  'docProcessor',
  'docSmall'
)

jest.mock('axios')

beforeAll(async () => {
  jest.resetAllMocks()
  await rm(VOLATILE)
  await mkdirp(VOLATILE)
})

const documentationConfig = [
  {
    fileName: path.join(FIXTURES, 'index.adoc'),
    dev: {
      pageId: '0815'
    },
    prd: {
      pageId: '4711'
    }
  }
]

test('Tests the complete flow', async () => {
  const expectedMarkdown = await fs.promises.readFile(
    path.join(FIXTURES, 'expected_markdown.md'),
    'utf8'
  )
  expecedPageUploadRequestPayload.body.storage.value = expectedMarkdown

  // get the current page content
  ;(axios.get as jest.Mock).mockResolvedValueOnce(responsePageContent)

  // get the existing attachments
  ;(axios.get as jest.Mock).mockResolvedValueOnce(responsePageAttachments)

  // upload the new site
  ;(axios.put as jest.Mock).mockResolvedValueOnce(responseUpload)

  // delete unused Attachments 'trash'
  ;(axios.delete as jest.Mock).mockResolvedValueOnce('ok')

  // Two calls for one attachment 'purge'
  ;(axios.delete as jest.Mock).mockResolvedValueOnce('ok')

  // upload new attachments
  ;(axios.post as jest.Mock).mockResolvedValueOnce('ok')

  await expect(
    docProcessor({
      username: 'myUser',
      password: 'myPasswd',
      target: 'dev',
      buildDir: VOLATILE,
      documentationConfig
    })
  ).resolves.toBeUndefined()

  // get page content
  expect(axios.get).toHaveBeenNthCalledWith(1, ...expectedPageContentRequest)

  // get the existing attachments
  expect(axios.get).toHaveBeenNthCalledWith(2, ...expectedPageAttchmentsRequest)

  // upload the new site
  expect(axios.put).toHaveBeenCalledWith(...expecedPageUploadRequest)

  // delete unused Attachments
  expect(axios.delete).toHaveBeenNthCalledWith(
    1,
    ...expectedRequestDeleteAttachmentTrash
  )
  expect(axios.delete).toHaveBeenNthCalledWith(
    2,
    ...expectedRequestDeleteAttachmentPurge
  )

  // upload new attachments
  expect(axios.post).toHaveBeenCalled()
})

const expectedPageContentRequest = [
  '/content/0815',
  {
    auth: { password: 'myPasswd', username: 'myUser' },
    baseURL: 'https://onrunning.atlassian.net/wiki/rest/api',
    headers: { Accept: 'application/json' },
    method: 'get'
  }
]
const expectedPageAttchmentsRequest = [
  '/content/0815/child/attachment',
  {
    auth: { password: 'myPasswd', username: 'myUser' },
    baseURL: 'https://onrunning.atlassian.net/wiki/rest/api',
    headers: { Accept: 'application/json' }
  }
]

const expectedRequestDeleteAttachmentTrash = [
  '/content/unused0815ID?status=current',
  {
    auth: { password: 'myPasswd', username: 'myUser' },
    baseURL: 'https://onrunning.atlassian.net/wiki/rest/api',
    headers: { Accept: 'application/json' }
  }
]
const expectedRequestDeleteAttachmentPurge = [
  '/content/unused0815ID?status=trashed',
  {
    auth: { password: 'myPasswd', username: 'myUser' },
    baseURL: 'https://onrunning.atlassian.net/wiki/rest/api',
    headers: { Accept: 'application/json' }
  }
]

const expecedPageUploadRequestPayload = {
  body: {
    storage: {
      representation: 'wiki',
      value: 'to be replaced'
    }
  },
  id: '0815',
  status: 'current',
  title: 'Demo Gumbo',
  type: 'page',
  version: { number: 6 }
}

const expecedPageUploadRequest = [
  '/content/0815',
  expecedPageUploadRequestPayload,
  {
    auth: { password: 'myPasswd', username: 'myUser' },
    baseURL: 'https://onrunning.atlassian.net/wiki/rest/api',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
  }
]
