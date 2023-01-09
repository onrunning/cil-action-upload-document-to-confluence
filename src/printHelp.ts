/**
 * Prints a Help message to the user in case of an error
 * @returns void
 */
export function printHelp(): void {
  // eslint-disable-next-line no-console
  console.log(`
    -------------------------------------------  
    - Deploy Documentation Action
    -------------------------------------------  
    The Following Parameter are supported:
      confluence_user     - (mandatory) The user to connect to confluence
      confluence_password - (mandatory) The password for the user
      target              - (default=prd) The target name (dev|uat|prd)
      config_file         - The name of the config file. Default = doc/docConfigConfluence.json
      build_directory     - the tmp directory to build the documentation
`)
}
