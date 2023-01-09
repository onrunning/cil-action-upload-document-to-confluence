/* eslint-disable no-console */

import { configFileReader } from './docProcessor/configFileReader'
import { docProcessor } from './docProcessor/docProcessor'
import { getInputData } from './getInputData'

const inputData = getInputData()

configFileReader(inputData.configFile)
  .then(async (documentationConfig) => {
    return await docProcessor({
      username: inputData.username,
      password: inputData.password,
      buildDir: 'docBuild',
      documentationConfig,
      target: inputData.target
    })
  })
  .then(() => {
    console.log('Publishing documents finished')
  })
  .catch((error) => {
    console.log('Publishing documents finished with ERROR')
    console.log(error)
    console.log(error.stack)
    throw error // if there is an error the action should fail
  })
