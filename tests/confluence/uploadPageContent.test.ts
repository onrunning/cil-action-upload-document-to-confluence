import * as dotenv from 'dotenv'
import axios, { AxiosResponse } from 'axios'
import { uploadPageContent } from '../../src/confluence/uploadPageContent'
dotenv.config()

jest.mock('axios')

const username = 'myUser'
const password = 'myPasswd'
const pageId = '1992491009'

const title = 'Demo Bazong'
const version = 12
const content = '# Some Great Markdown'

const response: AxiosResponse = {
  data: {
    id: '1992491009',
    type: 'page',
    status: 'current',
    title: 'Demo Gumbo',
    space: {},
    history: {},
    version: {
      number: 5
    }
  },
  status: 200,
  statusText: 'ok',
  headers: {},
  config: {}
}

test('should return the meta content information from the page', async () => {
  ;(axios.put as jest.Mock).mockResolvedValue(response)

  await uploadPageContent({
    username,
    password,
    pageId,
    content,
    title,
    version
  })

  expect(axios.put).toHaveBeenCalledWith(
    '/content/1992491009',
    {
      body: {
        storage: { representation: 'wiki', value: '# Some Great Markdown' }
      },
      id: '1992491009',
      status: 'current',
      title: 'Demo Bazong',
      type: 'page',
      version: { number: 12 }
    },
    {
      auth: { password: 'myPasswd', username: 'myUser' },
      baseURL: 'https://onrunning.atlassian.net/wiki/rest/api',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
  )
})
