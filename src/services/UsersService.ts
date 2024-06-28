const API_DOMAIN = import.meta.env.VITE_API_DOMAIN || 'https://localhost'
const baseUrl = API_DOMAIN+"/api/v1/authentication"

interface Authentication {
  data:{
    access_token: string,
    expires_in: number,
    token_type: string,
    scope: string
  }
}

export async function validateSignIn(username: string,password: string): Promise<Authentication> {
  const response = await fetch(
    baseUrl, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }),
      body: JSON.stringify({
        "username": username,
        "password": password,
        "grant_type": "password",
        "client_id" : 2658
      })
    }
  )
  return await response.json()
}
