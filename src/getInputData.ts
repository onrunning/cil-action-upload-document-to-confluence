import * as core from '@actions/core'
import { printHelp } from './printHelp'

/** Defines the result from the function @see getInputData */
interface GetInputDataResult {
  /** The user to connect to confluence */
  username: string

  /** The password for the user */
  password: string

  /** The target (dev|uat|prd) */
  target: 'dev' | 'uat' | 'prd'

  /** The name of the config file. Default = doc/docConfigConfluence.json */
  configFile: string

  /** The tempo build directory for the documentation */
  buildDir: string
}

/**
 * Reads the input data from from the environment
 * @returns
 */
export function getInputData(): GetInputDataResult {
  const username = core.getInput('confluence_user')
  const password = core.getInput('confluence_password')
  const target = core.getInput('target') ?? 'prd'
  const configFile =
    core.getInput('config_file') ?? 'doc/docConfigConfluence.json'
  const buildDir = core.getInput('build_directory') ?? 'docBuild'

  core.setSecret('confluence_password')

  if (target !== 'prd' && target !== 'uat' && target !== 'dev') {
    printHelp()
    throw new Error(
      `The 'CONFLUENCE_TARGET' must ne one of (dev|uat|prd. '${target}' is invalid)`
    )
  }

  if (username === undefined || password === undefined) {
    printHelp()
    throw new Error('Mandatory variables are not set')
  }

  return { username, password, target, configFile, buildDir }
}
