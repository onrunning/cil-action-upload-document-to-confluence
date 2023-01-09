import * as dotenv from 'dotenv'
import path from 'path'
import axios, { AxiosResponse } from 'axios'
import { uploadPageAttachments } from '../../src/confluence/uploadPageAttachments'
dotenv.config()

jest.mock('axios')

const username = 'myUser'
const password = 'myPasswd'
const pageId = '1992491009'

const FIXTURES = path.join(
  __dirname,
  '..',
  'fixtures',
  'confluence',
  'uploadPageAttachments'
)

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

test('should call the axios post method with the expecetd request', async () => {
  ;(axios.post as jest.Mock).mockResolvedValue(response)

  await uploadPageAttachments({
    username,
    password,
    pageId,
    files: [path.join(FIXTURES, 'file1.svg'), path.join(FIXTURES, 'file2.svg')]
  })

  const lastCall = (axios.post as jest.Mock).mock.lastCall
  expect(lastCall).toBeDefined()
  expect(Array.isArray(lastCall)).toBeTruthy()
  expect(lastCall.length).toBe(3)

  // Get the second entry of the formdata
  const formData = lastCall[1]
  const fileData1 = formData._streams[0]
  const fileData2 = formData._streams[3]

  expect(fileData1).toMatch(/filename="file1\.svg"/)
  expect(fileData2).toMatch(/filename="file2\.svg"/)
})
