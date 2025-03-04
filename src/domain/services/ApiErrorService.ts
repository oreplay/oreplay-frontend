import { ApiError } from "../models/ApiError.ts"
import { AxiosError } from "axios"

const toString = (err: unknown): string => {
  const error = err as AxiosError<ApiError>
  const data = error?.response?.data
  if (!data) {
    return "Unknown error " + String(err)
  }
  let errorMsg = data.error
  const errorFields = data?.error_fields
  if (errorFields) {
    const key = Object.keys(errorFields)[0]
    const message = String(Object.values(errorFields[key])[0])
    errorMsg += ` (${key}) ${message}`
  }
  return errorMsg
}

export const apiErrorService = {
  toString,
}
