/**
 * Defines the configuration of one single document to be published
 */
export interface DocumentationConfig {
  // FIXME: To have this extra element is cumbersum. But I did not know how to overcome it.
  config: DocumentationConfigElement[]
}

export interface DocumentationConfigElement {
  /** The name of the asciidoctor file to be published */
  fileName: string

  /**
   * The idea behind different targets is that the developer can test the created documentation
   * in the development phase. So problems in the documentation process could already be found
   * here.
   */
  dev?: {
    /** The pageId for development */
    pageId?: string
  }
  uat?: {
    /** The uat pageId */
    pageId?: string
  }
  prd: {
    /** The production Page Id */
    pageId: string
  }
}
