import React, {createContext, useState} from "react";
import {validateSignIn} from "../services/UsersService.ts";

export interface AuthContextInterface {
  user:string|null,
  token:string|null,
  loginAction: (email:string,password:string)=>Promise<void>,
  logoutAction:()=>void
}
export const AuthContext = createContext<AuthContextInterface|null>(null)

export function AuthProvider (props:{children: React.ReactNode}) {

  const [token,setToken] = useState<null | string>(null);
  const [user,setUser] = useState<null | string>(null);

  const loginAction = (user:string,password:string) => {
    const signInPromise = validateSignIn(user,password)
    return signInPromise.then((response)=>{
        setToken(response.data.access_token)
        setUser(user) // TODO: set user from /me endpoint
      }, (reason)=>{
        console.log(reason)
      })
  }

  const logoutAction = () => {
    //TODO: logout in backend
    setToken(null)
    setUser(null)
  }


  return (
    <AuthContext.Provider value={{token,user,loginAction,logoutAction}}>
      {props.children}
    </AuthContext.Provider>);
}