import React, {createContext, useState} from "react";
import {deleteToken, getUserData, validateSignIn} from "../services/UsersService.ts";
import {UserModel} from "./EntityTypes.ts";

/**
 * Available information when calling useAuth() hook
 * @property user User model if a user is logged in, otherwise null
 * @property token authentication token if a user is logged in, otherwise null
 * @property loginAction function to perform authentication with code and codeVerifier
 * @property logoutAction function to perform log out from server
 */
export interface AuthContextInterface {
  user:UserModel|null,
  token:string|null,
  loginAction: (code:string,codeVerifier:string)=>Promise<boolean>,
  logoutAction:()=>Promise<boolean>
}

/**
 * @private Global context used to provide authentication
 */
export const AuthContext = createContext<AuthContextInterface|null>(null)

/**
 * This component setups a context in which useAuth() hook can be called.
 * @param props it only accepts a children element
 */
export function AuthProvider (props:{children: React.ReactNode}) {

  const [token,setToken] = useState<string | null>(null);
  const [user,setUser] = useState<UserModel | null>(null);

  /**
   * Perform login. This function set the token and user information that
   * ara available on the useAuth() hook.
   * @param code authorization code
   * @param codeVerifier code verifier created in the frontend during auth init
   * @returns A promise that is
   */
  const loginAction = async (code:string,codeVerifier:string):Promise<boolean> => {
    try {
      const responseSignInToken = await validateSignIn(code,codeVerifier)
      setToken(responseSignInToken.data.access_token)
      try {
        const responseUserData = await getUserData(responseSignInToken.data.access_token)
        setUser(responseUserData.data)
        return true
      } catch (error) {
        console.log('Failed getUserData',error)
        return false
      }
    } catch (error) {
      console.log('signIn error',error)
      return false
    }

  }

  /**
   * Perform logout action in the server. Also, it sets token and user from useAuth() hook to null.
   * @returns true if logout successful, false if logout unsuccessful
   */
  const logoutAction = async () : Promise<boolean> => {
    if (token) {
      try {
        await deleteToken(token)
      } catch (error) {
        console.log(error);
        return false
      }
      setToken(null);
      setUser(null);
      return true
    } else {
      console.log('User was logged out')
      return true
    }
  }

  return (
    <AuthContext.Provider value={{token,user,loginAction,logoutAction}}>
      {props.children}
    </AuthContext.Provider>
  )
}