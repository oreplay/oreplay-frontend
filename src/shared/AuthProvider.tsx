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

  const loginAction = (user:string,password:string) => {
    const signInPromise = validateSignIn(user,password)
    return signInPromise.then((response)=>{
        setToken(response.data.access_token)

        getUserData(response.data.access_token).then((response)=>{
          setUser(response.data)
          console.log(response.data)
        },(reason)=>{
          console.log('Failed getUserData',reason)
        })
      }, (reason)=>{
        console.log('Failed validateSignIn',reason)
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