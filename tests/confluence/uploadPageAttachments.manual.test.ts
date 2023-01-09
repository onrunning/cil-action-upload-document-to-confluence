import * as dotenv from 'dotenv'
import path from 'path'
import { uploadPageAttachments } from '../../src/confluence/uploadPageAttachments'
dotenv.config()

const username = process.env.CONFLUENCE_USER ?? ''
const password = process.env.CONFLUENCE_PASSWORD ?? ''
const pageId = '1992491009'

const FIXTURES = path.join(
  __dirname,
  '..',
  'fixtures',
  'confluence',
  'uploadPageAttachments'
)

test.skip('ONLY FOR DEV: Executes a real requests to the real Confluence', async () => {
  const files = [
    path.join(FIXTURES, 'aToB.svg'),
    path.join(FIXTURES, 'bigger.svg')
  ]

  await uploadPageAttachments({
    username,
    password,
    pageId,
    files
  })
})
