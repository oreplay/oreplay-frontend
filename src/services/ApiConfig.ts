export const API_DOMAIN = import.meta.env.VITE_API_DOMAIN || 'https://localhost';

const headers = new Headers({
  'Content-Type': 'application/json',
  //'Accept': 'application/json',
  //'Cross-Origin': '*',
})

export async function get(url: string) {
  const response = await fetch(API_DOMAIN + url, {
    method: "GET",
    headers,
  });
  return await response.json();
}

export async function post(url: string, body: object | undefined) {
  const json = (body ? JSON.stringify(body) : undefined)
  const request = {
    method: 'POST',
    headers,
    body: json
  };
  const response = await fetch(API_DOMAIN + url, request);
  return await response.json();
}