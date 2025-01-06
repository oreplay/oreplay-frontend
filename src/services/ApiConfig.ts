export const API_DOMAIN = import.meta.env.VITE_API_DOMAIN || "https://www.oreplay.es/";

/**
 * Make a GET https query to the backend
 * @param url url to make the http query to
 * @param token (optional) bearer token to handle authentication
 */
export async function get<T>(url: string, token?: string | null): Promise<T> {
  const headers = new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
  });
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
  const response = await fetch(API_DOMAIN + url, {
    method: "GET",
    headers: headers,
  });
  return await response.json();
}

export async function post<T>(url: string, body?: object, token?: string | null): Promise<T> {
  const headers = new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
  });
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
  const response = await fetch(API_DOMAIN + url, {
    method: "POST",
    headers: headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  return await response.json();
}

/**
 * Generic backend delete request
 * @param url to make the request to
 * @param token User authentication token
 */
export async function deleteRequest(url: string, token?: string | null) {
  const headers = new Headers({
    Accept: "application/json",
  });
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
  return await fetch(API_DOMAIN + url, {
    method: "DELETE",
    headers: headers,
  });
}

/**
 * Generic backend patch request
 * @param url to make the request to
 * @param body Content to be patched on the server
 * @param token User authentication token
 */
export async function patch(url: string, body?: object, token?: string | null) {
  const headers = new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
  });
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
  return await fetch(API_DOMAIN + url, {
    method: "PATCH",
    headers: headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}
