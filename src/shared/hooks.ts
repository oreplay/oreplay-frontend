import {useContext, useEffect, useState} from "react";
import {ClassModel, EventDetailModel, RunnerModel} from "./EntityTypes.ts";
import {AuthContext, AuthContextInterface} from "./AuthProvider.tsx";
import {getEventDetail, getRunnersInStage} from "../pages/Results/services/EventService.ts";

/**
 * Get the runner list from the server associated with the event, stage and class. When the class
 * is provided as a state, the list will be updated automatically if any of the three params gets
 * updated.
 * @param event_id
 * @param stage_id
 * @param activeClass
 * @returns A list [runnerList,isLoading]
 * @returns runnersList:RunnerModel[] state with the desired runners
 * @returns isLoading:boolean state to know when result are being fetch
 */
export function useRunners(event_id:string,stage_id:string,activeClass:ClassModel|null):[RunnerModel[],boolean] {
  const [isLoading,setIsLoading] = useState(true);
  const [runnerList, setRunnerList] = useState<RunnerModel[]>([])

  //fetch from back-end
  useEffect(() => {
    if (activeClass){
      getRunnersInStage(event_id,stage_id,activeClass.id).then((response)=>{
        setRunnerList(response.data)
        setIsLoading(false)
      },(error)=>{
        console.log(error);
        setIsLoading(false)
      })
    } else {
      setRunnerList([])
      setIsLoading(false);
    }
    return () => {
      setIsLoading(true)
    }
  },[event_id,stage_id,activeClass])

  return [runnerList,isLoading]
}

/**
 * Provide authentication states. The AuthContextInterface is given:
 * @returns user : UserModel|null
 * @returns token : string|null
 * @returns loginAction : (email:string,password:string)=>Promise<boolean>
 * @returns logoutAction : (void)=>Promise<boolean>
 */
export function useAuth() {
  return useContext(AuthContext) as AuthContextInterface;
}

/**
 * Get a state with the `EventDetailModel` information. The state get updated when the authentication
 * or the id changes.
 * @param event_id
 * @returns [EventDetailModel,isLoading]
 */
export function useEventDetail(event_id:string):[EventDetailModel|null,boolean] {
  const [EventDetail,setEventDetail] = useState<EventDetailModel|null>(null);
  const [isLoading,setIsLoading] = useState(true);
  //const {token} = useAuth()

  useEffect(() => {
    getEventDetail(event_id).then((response)=>{//temporary removed token due to BACKs bug
      setEventDetail(response.data)
      setIsLoading(false)

      return ()=>setIsLoading(true)
    })
  },[event_id])//,token])
  return [EventDetail,isLoading]
}