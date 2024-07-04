import {useContext, useEffect, useState} from "react";
import {activeResultBottomMenuContext} from "./Context.ts";
import {ClassModel, RunnerModel} from "./EntityTypes.ts";
import {getRunnersInStage} from "../services/EventService.ts";
import {AuthContext, AuthContextInterface} from "./AuthProvider.tsx";

/**
 * Set the bottom navigation bar focus on one of the possible submenus. This way, the focus is
 * correctly set when the menu is directly loaded from the url. It works using
 * activeResultBottomMenuContext context.
 * @param newActiveMenu 1='startList', 2='results', 3='splits'
 */
export function useBottomActiveMenu(newActiveMenu:number) {
  const setActiveMenu = useContext(activeResultBottomMenuContext);
  if (setActiveMenu) {
    setActiveMenu(newActiveMenu);
  }
}

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