declare module 'src/types/node-pandoc'

declare function nodePandoc(
  sourceFile: string,
  args: string,
  callback: (err: Error | null | undefined) => void
): void
