import * as dotenv from 'dotenv'
import { uploadPageContent } from '../../src/confluence/uploadPageContent'
dotenv.config()

const username = process.env.CONFLUENCE_USER ?? ''
const password = process.env.CONFLUENCE_PASSWORD ?? ''
const pageId = '1992491009'

const title = 'Demo Bazong 12'
const version = 14
const content =
  '# Install\nnpm run install --save @onrunning/cil-lib-translation\n\n# translateKey\n\nThis function translate keys with the help of a hierachy map into translated values.'

test.skip('ONLY FOR DEV: Executes a real requests to the real Confluence', async () => {
  await uploadPageContent({
    username,
    password,
    pageId,
    content,
    title,
    version
  })
})
