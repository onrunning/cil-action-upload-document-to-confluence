import Ajv from 'ajv'
import { DocumentationConfigElement } from './configFileInterface'
import schema from './configFileSchema.json'

// stores the compiled schema
const validateFunction = new Ajv({ allErrors: true }).compile(schema)

export function configFileValidator(
  value: unknown
): DocumentationConfigElement[] {
  if (validateFunction(value)) {
    return value.config as unknown as DocumentationConfigElement[]
  } else {
    throw new Error(JSON.stringify(validateFunction.errors, null, 2))
  }
}
