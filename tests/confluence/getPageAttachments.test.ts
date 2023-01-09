import * as dotenv from 'dotenv'
import axios, { AxiosResponse } from 'axios'
import { getPageAttachments } from '../../src/confluence/getPageAttachments'
dotenv.config()

jest.mock('axios')

const username = 'myUser'
const password = 'myPasswd'
const pageId = '1992491009'

const response: AxiosResponse = {
  data: {
    results: [
      {
        id: 'att1994850421',
        type: 'attachment',
        status: 'current',
        title: 'aToB.svg',
        macroRenderedOutput: {},
        metadata: { mediaType: 'image/svg+xml' }
      }
    ]
  },
  status: 200,
  statusText: 'ok',
  headers: {},
  config: {}
}

test('should return the image names from the page', async () => {
  ;(axios.get as jest.Mock).mockResolvedValue(response)

  const attachmentNames = await getPageAttachments({
    username,
    password,
    pageId
  })
  expect(attachmentNames).toEqual([
    {
      id: 'att1994850421',
      name: 'aToB.svg'
    }
  ])
})
