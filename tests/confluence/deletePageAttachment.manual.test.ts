import * as dotenv from 'dotenv'
import { deletePageAttachment } from '../../src/confluence/deletePageAttachment'
dotenv.config()

const username = process.env.CONFLUENCE_USER ?? ''
const password = process.env.CONFLUENCE_PASSWORD ?? ''
const attachmentId = 'att1996849186'

test.skip('ONLY FOR DEV: Executes a real requests to the real Confluence', async () => {
  await deletePageAttachment({
    username,
    password,
    attachmentId
  })
})
