export const API_DOMAIN = import.meta.env.VITE_API_DOMAIN || 'https://localhost';

const headers = new Headers({
  'Content-Type': 'application/json',
})

export async function get(url: string) {
  const response = await fetch(API_DOMAIN + url, {
    method: "GET",
    headers: headers,
  });
  return await response.json();
}

export async function post(url: string, body: object | undefined) {
  const response = await fetch(API_DOMAIN + url,
      {
        method: 'POST',
        headers: headers,
        body: (body ? JSON.stringify(body) : undefined),
        }
      );
  return await response.json();
}