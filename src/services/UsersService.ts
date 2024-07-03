import {get, post} from './ApiConfig.ts'
import {useContext} from "react";
import {AuthContext, AuthContextInterface} from "../shared/AuthProvider.tsx";
import {UserModel, Data} from "../shared/EntityTypes.ts";

const baseUrl: string = "/api/v1/authentication"

interface UserTokenModel {
  data:{
    access_token: string,
    expires_in: number,
    token_type: string,
    scope: string
  }
}

export async function validateSignIn(username: string,password: string): Promise<UserTokenModel> {
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

export function useAuth() {
  return useContext(AuthContext) as AuthContextInterface;
}