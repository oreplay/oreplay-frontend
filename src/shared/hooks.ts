import { useContext, useEffect, useState } from "react"
import { EventDetailModel } from "./EntityTypes.ts"
import { AuthContext, AuthContextInterface } from "./AuthProvider.tsx"
import { getEventDetail } from "../pages/Results/services/EventService.ts"

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

/**
 * Get a state with the `EventDetailModel` information. The state get updated when the authentication
 * or the id changes.
 * @param event_id
 * @returns [EventDetailModel,isLoading]
 */
export function useEventDetail(event_id: string): [EventDetailModel | null, boolean] {
  const [EventDetail, setEventDetail] = useState<EventDetailModel | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  //const {token} = useAuth()

  useEffect(() => {
    getEventDetail(event_id).then((response) => {
      //temporary removed token due to BACKs bug
      setEventDetail(response.data)
      setIsLoading(false)

      return () => setIsLoading(true)
    })
  }, [event_id]) //,token])
  return [EventDetail, isLoading]
}
