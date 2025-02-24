import { useContext } from "react"
import { AuthContext, AuthContextInterface } from "./AuthProvider.tsx"

/**
 * Provide authentication states. The AuthContextInterface is given:
 * @returns user : UserModel|null
 * @returns token : string|null
 * @returns loginAction : (email:string,password:string)=>Promise<boolean>
 * @returns logoutAction : (void)=>Promise<boolean>
 */
export function useAuth() {
  return useContext(AuthContext) as AuthContextInterface
}
