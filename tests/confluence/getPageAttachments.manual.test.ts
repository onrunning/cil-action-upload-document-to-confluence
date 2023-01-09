import * as dotenv from 'dotenv'
import { getPageAttachments } from '../../src/confluence/getPageAttachments'
dotenv.config()

const username = process.env.CONFLUENCE_USER ?? ''
const password = process.env.CONFLUENCE_PASSWORD ?? ''
const pageId = '1992491009'

test.skip('ONLY FOR DEV: Executes a real requests to the real Confluence', async () => {
  const attachmentNames = await getPageAttachments({
    username,
    password,
    pageId
  })

  // eslint-disable-next-line no-console
  console.log(attachmentNames)
})
