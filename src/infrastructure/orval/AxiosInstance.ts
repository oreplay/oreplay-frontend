import axios, { AxiosInstance } from "axios"

let axiosClientInstance: AxiosInstance | null = null

const createAxiosInstance = (baseURL: string, headers: Record<string, string> = {}) => {
  return axios.create({
    baseURL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
  })
}

export const initAxiosClientInstance = (baseURL: string, headers: Record<string, string> = {}) => {
  axiosClientInstance = createAxiosInstance(baseURL, headers)
}

export const getAxiosClientInstance = (): AxiosInstance => {
  if (!axiosClientInstance) {
    throw new Error("Axios instance not initialized. Call initAxiosInstance first.")
  }
  return axiosClientInstance
}

export const clearAxiosClientInstance = () => {
  axiosClientInstance = null
}

export const createIsolatedAxiosInstance = (
  baseURL: string,
  headers: Record<string, string> = {},
) => {
  return createAxiosInstance(baseURL, headers)
}

export const updateAxiosClientHeaders = (headers: Record<string, string | undefined>) => {
  if (!axiosClientInstance) {
    throw new Error("Axios instance not initialized. Call initAxiosClientInstance first.")
  }

  Object.entries(headers).forEach(([key, value]) => {
    if (key in axiosClientInstance!.defaults.headers) {
      delete axiosClientInstance!.defaults.headers[key]
    }
    axiosClientInstance!.defaults.headers.common[key] = value
  })
}
