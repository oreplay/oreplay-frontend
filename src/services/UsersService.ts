import { post } from './ApiConfig.ts'

const baseUrl: string = "/api/v1/authentication"

interface Authentication {
  data:{
    access_token: string,
    expires_in: number,
    token_type: string,
    scope: string
  }
}

export async function validateSignIn(username: string,password: string): Promise<Authentication> {
  return await post(
    baseUrl, {
      "username": username,
      "password": password,
      "grant_type": "password",
      "client_id" : 2658
    }
  )
}
