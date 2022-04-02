import { validate, ValidatorResult } from 'jsonschema'
export { ValidatorResult }
export function trvalidate<T>(v: any, schema?: object): ValidatorResult{
  return validate(v, schema)
}