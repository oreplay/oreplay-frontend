import axios from "axios"

export const API_DOMAIN = import.meta.env.VITE_API_DOMAIN || "https://www.oreplay.es/"
export const API_BASE_URL = API_DOMAIN + "api/v1/"

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
})

/**
 * Sends the signed-in user's access token with every request made through `axiosInstance`, or
 * stops sending it after logout. Requests that pass their own token keep using that one.
 * @param token The user's access token, or `null` when nobody is signed in.
 */
export function setApiAuthorization(token: string | null) {
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete axiosInstance.defaults.headers.common.Authorization
  }
}

/**
 * Builds the axios config of a request.
 * @param token The token to authenticate this request with; without one the signed-in user's
 * token set by `setApiAuthorization` is used, if any.
 * @returns The request config with its headers.
 */
function buildRequestConfig(token: string | null | undefined) {
  return {
    headers: buildHeaders(token),
  }
}

/**
 * Builds the headers of a request. `Authorization` is only set when a token is given, so that an
 * explicit `undefined` never hides the signed-in user's default one.
 * @param token The token to authenticate this request with, if any.
 * @returns The request headers.
 */
function buildHeaders(token: string | null | undefined) {
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json",
    Accept: "application/json",
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
