import {get, post} from './ApiConfig.ts'
import {UserModel, Data} from "../shared/EntityTypes.ts";

const baseUrl: string = "/api/v1/authentication"

interface UserTokenModel {
    access_token: string,
    expires_in: number,
    token_type: string,
    scope: string
}

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

export function getUserData(token:string): Promise<Data<UserModel>> {
  return get<Data<UserModel>>('api/v1/me',token)
}