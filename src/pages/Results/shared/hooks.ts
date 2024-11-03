import {useCallback, useEffect, useState} from "react";
import {getClassesInStage, getRunnersInStage, getStageDetail} from "../services/EventService.ts";
import {ClassModel, RunnerModel} from "../../../shared/EntityTypes.ts";
import {useLocation, useParams, useSearchParams} from "react-router-dom";
import {useAuth} from "../../../shared/hooks.ts";

export function useFetchClasses(eventId:string, stageId:string):[ClassModel|null,(class_id:string)=>void,ClassModel[],boolean] {
  const ACTIVE_CLASS_SEARCH_PARAM = "class_id"
  const [searchParams,setSearchParams] = useSearchParams();

  // Associated states
  const [isLoading,setIsLoading] = useState<boolean>(true);
  const [classesList,setClassesList] = useState<ClassModel[]>([]);
  const [activeClass,setActiveClassState] = useState<ClassModel|null>(null);

  // HTTP request
  useEffect(
    () => {

      const fetchClasses = async () => {
        try {
          const response = await getClassesInStage(eventId, stageId)
          // set Classes list
          setClassesList(response.data)

          // set active class from URL if given
          const new_active_class_id = searchParams.get(ACTIVE_CLASS_SEARCH_PARAM);
          if (new_active_class_id) {
            const new_active_class = response.data?.find(e=> e.id === new_active_class_id);
            if (new_active_class) {
              setActiveClassState(new_active_class);
            } else {
              console.log(`Provided class id ${new_active_class_id} doesn't exist. The classes list is ${classesList}`)
            }
          }
        } catch (error) {
          console.error("error in get classes: ", error);
        } finally {
          setIsLoading(false)
        }
      }

      fetchClasses()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ,[])

  // Set selected class function. It handles the search param usage
  const setActiveClassId = (newActiveClassId:string) => {
    const new_active_class = classesList.find((e) => e.id === newActiveClassId);
    if (new_active_class) {
      setActiveClassState(new_active_class)
      searchParams.set(ACTIVE_CLASS_SEARCH_PARAM,newActiveClassId)
      setSearchParams(searchParams,{replace:true})
    } else {
      console.error("The selected class is not valid")
    }
  }

  return [activeClass,setActiveClassId,classesList,isLoading]
}

export function useSelectedMenu(defaultMenu:number,menuOptionsLabels:string[]):[number,(newMenu:number) => void] {
  const [selectedMenu, setSelectedMenu] = useState<number>(defaultMenu);
  const [searchParams, setSearchParams] = useSearchParams()
  const ACTIVE_MENU_SEARCH_PARAM = 'menu'

  // Pick the right menu from Search Params
  useEffect(()=>{
    const desired_active_menu = searchParams.get(ACTIVE_MENU_SEARCH_PARAM)
    if (desired_active_menu) {
      setSelectedMenu(menuOptionsLabels.indexOf(desired_active_menu))
    } else {
      searchParams.set(ACTIVE_MENU_SEARCH_PARAM,menuOptionsLabels[defaultMenu])
      setSearchParams(searchParams,{replace:true})
    }

  },[defaultMenu, menuOptionsLabels, searchParams, setSearchParams])

  // update page when navigating
  const handleMenuChange = useCallback((newValue:number) => {
    setSelectedMenu(newValue)
    searchParams.set(ACTIVE_MENU_SEARCH_PARAM,menuOptionsLabels[newValue])
    setSearchParams(searchParams,{replace:true})
  },[menuOptionsLabels,searchParams,setSearchParams])

  return [selectedMenu,handleMenuChange];
}

export function useEventInfo() {
  const {token} = useAuth()

  const {eventId, stageId} = useParams()
  const {state} = useLocation()

  const [eventName, setEventName] = useState<string>("")
  const [stageName, setStageName] = useState<string>("")
  const [stageTypeId, setStageTypeId] = useState<string>("")

  useEffect(
    () => {
      //Check if state is empty. If it is, gather info from backend. It will ve empty if the user has not landed in this page navigating
      if (state === null) {
        console.log("Null states")
        getStageDetail(eventId as string,stageId as string,token).then(
          (response) => {
            setEventName(""); //TODO: modify back to get this info
            setStageName(response.data.description)
            setStageTypeId(response.data.stage_type.id)
          }
        )

        //Stage info came from router state. No extra backend call required
      } else {
        setEventName(state.eventName)
        setStageName(state.stageName)
        setStageTypeId(state.stageTypeId)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ,[])

  return {eventId:eventId as string,eventName:eventName,stageId:stageId as string,stageName:stageName,stageTypeId:stageTypeId}
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