import { useCallback, useEffect, useState } from "react"
import {
  getClassesInStage,
  getEventDetail,
  getEventList,
  getRunnersInStage,
} from "../services/EventService.ts"
import { ClassModel, EventModel } from "../../../shared/EntityTypes.ts"
import { useLocation, useParams, useSearchParams } from "react-router-dom"
import { useAuth } from "../../../shared/hooks.ts"
import {
  calculatePositionsAndBehindsFootO,
  processRunnerData,
} from "../components/VirtualTicket/shared/virtualTicketFunctions.ts"
import { ProcessedRunnerModel } from "../components/VirtualTicket/shared/EntityTypes.ts"

export function useFetchClasses(): [
  ClassModel | null,
  (class_id: string) => void,
  ClassModel[],
  boolean,
  () => void,
] {
  const ACTIVE_CLASS_SEARCH_PARAM = "class_id"

  const { eventId, stageId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  // Associated states
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [classesList, setClassesList] = useState<ClassModel[]>([])
  const [activeClass, setActiveClassState] = useState<ClassModel | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // HTTP request
  useEffect(
    () => {
      const fetchClasses = async () => {
        try {
          const response = await getClassesInStage(eventId as string, stageId as string)
          // set Classes list
          setClassesList(response.data)

          // set active class from URL if given
          const new_active_class_id = searchParams.get(ACTIVE_CLASS_SEARCH_PARAM)
          if (new_active_class_id) {
            const new_active_class = response.data?.find((e) => e.id === new_active_class_id)
            if (new_active_class) {
              setActiveClassState(new_active_class)
            } else {
              console.log(
                `Provided class id ${new_active_class_id} doesn't exist. The classes list is ${classesList.toString()}`,
              )
            }
          }
        } catch (error) {
          console.error("error in get classes: ", error)
        } finally {
          setIsLoading(false)
        }
      }

      void fetchClasses()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refreshTrigger],
  )

  // Set selected class function. It handles the search param usage
  const setActiveClassId = (newActiveClassId: string) => {
    const new_active_class = classesList.find((e) => e.id === newActiveClassId)
    if (new_active_class) {
      setActiveClassState(new_active_class)
      searchParams.set(ACTIVE_CLASS_SEARCH_PARAM, newActiveClassId)
      setSearchParams(searchParams, { replace: true })
    } else {
      console.error("The selected class is not valid")
    }
  }

  const refresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1)
  }, [])

  return [activeClass, setActiveClassId, classesList, isLoading, refresh]
}

export function useFetchEvents(
  when?: "today" | "past" | "future",
  limit?: number,
): [EventModel[], boolean, number, (page: number) => void, number] {
  const { token } = useAuth()

  // Required states
  const [events, setEvents] = useState<EventModel[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [numPages, setNumPages] = useState<number>(1)

  // HTTP query
  useEffect(() => {
    void getEventList(page, when, token, limit).then((response) => {
      setEvents(response.data)
      setIsLoading(false)
      setNumPages(Math.ceil(response.total / response.limit))

      return () => setIsLoading(true)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  return [events, isLoading, page, setPage, numPages]
}

export function useSelectedMenu(
  defaultMenu: number,
  menuOptionsLabels: string[],
): [number, (newMenu: number) => void] {
  const [selectedMenu, setSelectedMenu] = useState<number>(defaultMenu)
  const [searchParams, setSearchParams] = useSearchParams()
  const ACTIVE_MENU_SEARCH_PARAM = "menu"

  // Pick the right menu from Search Params
  useEffect(() => {
    if (menuOptionsLabels.length > 0) {
      // We have to wait for menuOptionLabels to be known until the back returns the stageType
      const desired_active_menu = searchParams.get(ACTIVE_MENU_SEARCH_PARAM)
      if (desired_active_menu && menuOptionsLabels.includes(desired_active_menu)) {
        // Set selected menu to the index of the active menu from URL params if it exists
        setSelectedMenu(menuOptionsLabels.indexOf(desired_active_menu))
      } else {
        // Otherwise, set the URL to the default menu
        const defaultMenuLabel = menuOptionsLabels[defaultMenu]
        searchParams.set(ACTIVE_MENU_SEARCH_PARAM, defaultMenuLabel)
        setSearchParams(searchParams, { replace: true }) // Use replace: true to avoid history stack changes
        setSelectedMenu(defaultMenu)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOptionsLabels])

  // update page when navigating
  const handleMenuChange = useCallback(
    (newValue: number) => {
      setSelectedMenu(newValue)
      searchParams.set(ACTIVE_MENU_SEARCH_PARAM, menuOptionsLabels[newValue])
      setSearchParams(searchParams, { replace: true })
    },
    [menuOptionsLabels, searchParams, setSearchParams],
  )

  return [selectedMenu, handleMenuChange]
}

export function useEventInfo() {
  const { token } = useAuth()

  const { eventId, stageId } = useParams()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { state } = useLocation()

  const [eventName, setEventName] = useState<string>("")
  const [organizerName, setOrganizerName] = useState<string>("")
  const [stageName, setStageName] = useState<string>("")
  const [stageTypeId, setStageTypeId] = useState<string>("")
  const [singleStage, setSingleStage] = useState<boolean>(false)

  useEffect(
    () => {
      //Check if state is empty. If it is, gather info from backend. It will ve empty if the user has not landed in this page navigating
      if (state === null) {
        void getEventDetail(eventId as string, token).then((response) => {
          // Event name
          setEventName(response.data.description)

          // Organizer name
          setOrganizerName(response.data.organizer?.name as string)

          // Single stage
          if (response.data.stages.length == 1) {
            setSingleStage(true)
          } else {
            setSingleStage(false)
          }

          // Stage info
          const current_stage = response.data.stages.find((stage) => stage.id === stageId)
          if (current_stage) {
            setStageName(response.data.description)
            setStageTypeId(current_stage.stage_type.id)
          } else {
            throw new Error(
              `The stage ${stageId} does not belong to ${eventId} (${response.data.description}).`,
            ) //TODO: redirect to 404 not found
          }
        })

        //Stage info came from router state. No extra backend call required
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
        setEventName(state.eventName)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
        setStageName(state.stageName)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
        setStageTypeId(state.stageTypeId)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
        setSingleStage(state.singleStage)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return {
    eventId: eventId as string,
    eventName: eventName,
    organizerName: organizerName,
    stageId: stageId as string,
    stageName: stageName,
    stageTypeId: stageTypeId,
    singleStage: singleStage,
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
export function useRunners(
  event_id: string,
  stage_id: string,
  activeClass: ClassModel | null,
): [ProcessedRunnerModel[], boolean, () => void] {
  const [isLoading, setIsLoading] = useState(true)
  const [runnerList, setRunnerList] = useState<ProcessedRunnerModel[]>([])
  const [refreshTrigger, setRefreshTrigger] = useState(0) // Trigger for refresh

  //fetch from back-end
  useEffect(() => {
    if (activeClass) {
      getRunnersInStage(event_id, stage_id, activeClass.id).then(
        (response) => {
          let processRunnerList = processRunnerData(response.data)
          processRunnerList = calculatePositionsAndBehindsFootO(processRunnerList)

          setRunnerList(processRunnerList)
          setIsLoading(false)
        },
        (error) => {
          console.log(error)
          setIsLoading(false)
        },
      )
    } else {
      setRunnerList([])
      setIsLoading(false)
    }
    return () => {
      setIsLoading(true)
    }
  }, [event_id, stage_id, activeClass, refreshTrigger])

  // Function to trigger a refresh
  const refresh = () => setRefreshTrigger((prev) => prev + 1)

  return [runnerList, isLoading, refresh]
}
