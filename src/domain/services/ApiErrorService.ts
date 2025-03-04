import { ApiError } from "../models/ApiError.ts"

const toString = (data: ApiError): string => {
  let errorMsg = data.error
  const errorFields = data?.error_fields
  if (errorFields) {
    const key = Object.keys(errorFields)[0]
    const message = Object.values(errorFields[key])[0]
    errorMsg += ` (${key}) ${message}`
  }
  return errorMsg
}

export const apiErrorService = {
  toString,
}
