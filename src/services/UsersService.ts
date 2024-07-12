import {deleteRequest, get, post} from './ApiConfig.ts'
import {UserModel, Data} from "../shared/EntityTypes.ts";

const baseUrl = "/api/v1/authentication"

interface UserTokenModel {
    access_token: string,
    expires_in: number,
    token_type: string,
    scope: string
}

/**
 * Check in backend if a username and password are correct. If they are, it provides an
 * authentication token.
 * @param username
 * @param password
 */
export async function validateSignIn(username: string,password: string): Promise<Data<UserTokenModel>> {
  return await post(
    baseUrl, {
      "username": username,
      "password": password,
      "grant_type": "password",
      "client_id" : 2658
    }
  )
}

/**
 * Request backend invalidation of a token. In essence, it logs you out.
 * @param token to be invalidated
 */
export async function deleteToken(token:string): Promise<Response> {
  return await deleteRequest(baseUrl+`/${token}`)
}

/**
 * Request data of the user that is logged in with a given token
 * @param token
 */
export function getUserData(token:string): Promise<Data<UserModel>> {
  return get<Data<UserModel>>('/api/v1/me',token)
}