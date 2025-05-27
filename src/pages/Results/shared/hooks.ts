import { useCallback, useEffect, useRef, useState } from "react"
import { getClassesInStage, getClubsInStage, getEventList } from "../services/EventService.ts"
import { ClassModel, ClubModel, EventModel, Page } from "../../../shared/EntityTypes.ts"
import { useParams, useSearchParams } from "react-router-dom"
import { useAuth } from "../../../shared/hooks.ts"
import { useQuery, UseQueryResult } from "react-query"

export function useFetchClasses(): {
  activeItem: ClassModel | ClubModel | null
  isClass: boolean
  classesQuery: UseQueryResult<Page<ClassModel>>
  clubsQuery: UseQueryResult<Page<ClubModel>>
  refresh: () => void
  setClassClubId: (newItemId: string, isClass: boolean) => void
} {
  const { eventId, stageId } = useParams()

  // Associated states
  const [activeItem, setActiveItem] = useState<ClassModel | ClubModel | null>(null)
  const [isClass, setIsClass] = useState<boolean>(true)

  // HTTP request
  const classesQuery = useQuery(
    ["classes", stageId, eventId],
    () => getClassesInStage(eventId as string, stageId as string),
    {
      refetchOnWindowFocus: false,
    },
  )

  const clubsQuery = useQuery(
    ["clubs", stageId, eventId],
    () => getClubsInStage(eventId as string, stageId as string),
    {
      refetchOnWindowFocus: false,
    },
  )

  const { setClassClubSearchParam, getClassClubSearchParamName } = useClassClubSearchParams()

  const setClassClub = useCallback(
    (newItemId: string, isClass: boolean): void => {
      setIsClass(isClass)

      const desiredQuery: UseQueryResult<Page<ClassModel>> | UseQueryResult<Page<ClubModel>> =
        isClass ? classesQuery : clubsQuery
      const newItem: ClubModel | ClassModel | undefined = desiredQuery.data?.data.find(
        (c) => c.id === newItemId,
      )

      if (newItem) {
        setActiveItem(newItem)
        setClassClubSearchParam(newItem, isClass)
      }
    },
    [classesQuery, clubsQuery, setClassClubSearchParam],
  )

  const hasInitialized = useRef(false)
  useEffect(() => {
    if (hasInitialized.current) return
    if (!classesQuery.data || !clubsQuery.data) return
    hasInitialized.current = true

    const [itemName, isClassInSearchParams] = getClassClubSearchParamName()
    if (itemName && isClassInSearchParams !== null) {
      const item = findClassClub(isClassInSearchParams ? classesQuery : clubsQuery, itemName)
      if (item) {
        setIsClass(isClassInSearchParams)
        setActiveItem(item)
      }
    }
  }, [classesQuery, classesQuery.data, clubsQuery, clubsQuery.data, getClassClubSearchParamName])

  const refresh = useCallback((): void => {
    void classesQuery.refetch()
    void clubsQuery.refetch()
  }, [classesQuery, clubsQuery])

  return {
    activeItem: activeItem,
    isClass: isClass,
    classesQuery: classesQuery,
    clubsQuery: clubsQuery,
    refresh: refresh,
    setClassClubId: setClassClub,
  }
}

function findClassClub(query: UseQueryResult<Page<ClassModel | ClubModel>>, name: string) {
  return query.data?.data.find((value) => value.short_name === name)
}

const ACTIVE_CLASS_SEARCH_PARAM = "class"
const ACTIVE_CLUB_SEARCH_PARAM = "club"

export function useClassClubSearchParams(): {
  setClassClubSearchParam: (newItem: ClassModel | ClubModel, isClass: boolean) => void
  getClassClubSearchParamName: () => [string | null, boolean | null]
} {
  const [searchParams, setSearchParams] = useSearchParams()

  const setClassClubSearchParam = useCallback(
    (newItem: ClassModel | ClubModel, isClass: boolean) => {
      if (isClass) {
        searchParams.set(ACTIVE_CLASS_SEARCH_PARAM, newItem.short_name)
        searchParams.delete(ACTIVE_CLUB_SEARCH_PARAM)
      } else {
        searchParams.delete(ACTIVE_CLASS_SEARCH_PARAM)
        searchParams.set(ACTIVE_CLUB_SEARCH_PARAM, newItem.short_name)
      }

      setSearchParams(searchParams, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  const deleteAll = useCallback(() => {
    searchParams.delete(ACTIVE_CLASS_SEARCH_PARAM)
    searchParams.delete(ACTIVE_CLUB_SEARCH_PARAM)
  }, [searchParams])

  const getClassClubSearchParamName = useCallback((): [string | null, boolean | null] => {
    // Get params
    const classParamName = searchParams.get(ACTIVE_CLASS_SEARCH_PARAM)
    const clubParamName = searchParams.get(ACTIVE_CLUB_SEARCH_PARAM)

    // Class provided
    if (classParamName) {
      // Both provided, ignore
      if (clubParamName) {
        deleteAll()
        return [null, null]
      }

      return [classParamName, true]

      // Club provided
    } else if (clubParamName) {
      // Both provided, ignore
      if (classParamName) {
        deleteAll()
        return [null, null]
      }

      return [clubParamName, false]
      // No set
    } else {
      return [null, null]
    }
  }, [deleteAll, searchParams])

  return {
    setClassClubSearchParam: setClassClubSearchParam,
    getClassClubSearchParamName: getClassClubSearchParamName,
  }
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
