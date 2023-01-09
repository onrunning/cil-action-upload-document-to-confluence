/**
 * The only important value is the status here.
 */
export const responseUpload = {
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

/**
 * Mock response for getPageContent
 */
export const responsePageContent = {
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

/**
 * Returns a list of 5 images
 */
export const responsePageAttachments = {
  data: {
    results: [
      {
        id: 'att1999077531',
        type: 'attachment',
        status: 'current',
        title: 'Invalid file id - UNKNOWN_MEDIA_ID',
        macroRenderedOutput: {},
        metadata: {
          mediaType: 'image/svg+xml'
        },
        extensions: {
          mediaType: 'image/svg+xml',
          fileSize: 0,
          comment: '',
          fileId: 'UNKNOWN_MEDIA_ID'
        }
      },
      {
        id: 'att1998979107',
        type: 'attachment',
        status: 'current',
        title: 'CIL_CONVERTER_0b1cca5ed879a5c1e4377281a8121027.svg',
        macroRenderedOutput: {},
        metadata: {
          mediaType: 'image/svg+xml'
        },
        extensions: {
          mediaType: 'image/svg+xml',
          fileSize: 9102,
          comment: '',
          fileId: '8e3fd2b9-b461-4ec8-a05c-2891137e6e5f',
          collectionName: 'contentId-1992491009'
        }
      },
      {
        id: 'att1998979103',
        type: 'attachment',
        status: 'current',
        title: 'CIL_CONVERTER_e56160178c1f1eac2b5b74f27bf734a9.svg',
        macroRenderedOutput: {},
        metadata: {
          mediaType: 'image/svg+xml'
        },
        extensions: {
          mediaType: 'image/svg+xml',
          fileSize: 3957,
          comment: '',
          fileId: '5e2c769c-dbb8-46c0-9780-29dcbf68b370',
          collectionName: 'contentId-1992491009'
        }
      },
      {
        id: 'att1996849182',
        type: 'attachment',
        status: 'current',
        title: 'aToB.svg',
        macroRenderedOutput: {},
        metadata: {
          mediaType: 'image/svg+xml'
        },
        extensions: {
          mediaType: 'image/svg+xml',
          fileSize: 3957,
          comment: '',
          fileId: 'accbf0a1-6b8b-4deb-9636-363f00d53957',
          collectionName: 'contentId-1992491009'
        }
      },
      {
        id: 'unused0815ID',
        type: 'attachment',
        status: 'current',
        title: 'CIL_CONVERTER_0815_4711.svg',
        macroRenderedOutput: {},
        metadata: {
          mediaType: 'image/svg+xml'
        },
        extensions: {
          mediaType: 'image/svg+xml',
          fileSize: 3957,
          comment: '',
          fileId: 'accbf0a1-6b8b-4deb-9636-363f00d53958',
          collectionName: 'contentId-1992491009'
        }
      }
    ]
  },
  start: 0,
  limit: 50,
  size: 5
}
