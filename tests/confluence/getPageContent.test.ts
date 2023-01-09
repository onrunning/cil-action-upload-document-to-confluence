import * as dotenv from 'dotenv'
import axios, { AxiosResponse } from 'axios'
import { getPageContent } from '../../src/confluence/getPageContent'
dotenv.config()

jest.mock('axios')

const username = 'myUser'
const password = 'myPasswd'
const pageId = '1992491009'

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
  ;(axios.get as jest.Mock).mockResolvedValue(response)

  const titleVersion = await getPageContent({
    username,
    password,
    pageId
  })
  expect(titleVersion).toEqual({
    title: 'Demo Gumbo',
    version: 5
  })
})
