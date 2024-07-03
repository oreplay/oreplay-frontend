import React, {createContext, useState} from "react";
import {getUserData, validateSignIn} from "../services/UsersService.ts";
import {UserModel} from "./EntityTypes.ts";

export interface AuthContextInterface {
  user:UserModel|null,
  token:string|null,
  loginAction: (email:string,password:string)=>Promise<void>,
  logoutAction:()=>void
}
export const AuthContext = createContext<AuthContextInterface|null>(null)

export function AuthProvider (props:{children: React.ReactNode}) {

  const [token,setToken] = useState<string | null>(null);
  const [user,setUser] = useState<UserModel | null>(null);

  const loginAction = async (user:string,password:string) => {
    try {
      const responseSignInToken = await validateSignIn(user,password)
      setToken(responseSignInToken.data.access_token)
      try {
        const responseUserData = await getUserData(responseSignInToken.data.access_token)
        setUser(responseUserData.data)
      } catch (error) {
        console.log('Failed getUserData',error)
      }
    } catch (error) {
      console.log('signIn error',error)
    }
  }

  const logoutAction = () => {
    //TODO: logout in backend
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{token,user,loginAction,logoutAction}}>
      {props.children}
    </AuthContext.Provider>
  )
}