import axios from "axios"

export const API_DOMAIN = import.meta.env.VITE_API_DOMAIN || "https://www.oreplay.es/"

export const axiosInstance = axios.create({
  baseURL: API_DOMAIN + "api/v1/",
})

function buildRequestConfig(token: string | null | undefined) {
  return {
    headers: buildHeaders(token),
  }
}

function buildHeaders(token: string | null | undefined) {
  return {
    Authorization: token ? `Bearer ${token}` : undefined,
    "Content-Type": "application/json",
    Accept: "application/json"
  }
}

/**
 * Make a GET https query to the backend
 * @param url url to make the http query to
 * @param token (optional) bearer token to handle authentication
 */
export async function get<T>(url: string, token?: string | null): Promise<T> {
  const response = await axiosInstance.get<T>(url, buildRequestConfig(token))

  return response.data
}

export async function post<T>(url: string, body?: object, token?: string | null): Promise<T> {
  const response = await axiosInstance.post<T>(url, body, buildRequestConfig(token))
  return response.data
}

/**
 * Generic backend delete request
 * @param url to make the request to
 * @param token User authentication token
 */
export async function deleteRequest<T>(url: string, token?: string | null) {
  const response = await axiosInstance.delete<T>(url, buildRequestConfig(token))
  return response.data
}

/**
 * Generic backend patch request
 * @param url to make the request to
 * @param body Content to be patched on the server
 * @param token User authentication token
 */
export async function patch<T>(url: string, body?: object, token?: string | null) {
  const response = await axiosInstance.patch<T>(url, body, buildRequestConfig(token))
  return response.data
}
