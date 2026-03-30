import { AxiosInstance, AxiosRequestConfig } from "axios"
import { getAxiosClientInstance } from "./AxiosInstance"

const getClient = () => {
  return getAxiosClientInstance()
}

type ConfigWithClient = AxiosRequestConfig & {
  axiosInstance?: AxiosInstance
}

export const orvalAxiosInstance = async <T>(
  config: AxiosRequestConfig,
  options?: ConfigWithClient,
): Promise<T> => {
  let client
  if (options?.axiosInstance) {
    client = options?.axiosInstance
  } else {
    client = getClient()
  }
  return client({
    ...config,
    ...options,
  })
}
