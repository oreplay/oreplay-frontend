import RelayResults from "./pages/RelayResults/RelayResults.tsx"
import StageLayout from "../../components/StageLayout/StageLayout.tsx"
import { useFetchClasses } from "../../../../shared/hooks.ts"
import { Box } from "@mui/material"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import ResultTabsPanel from "../../components/ResultTabsPanel.tsx"
import ResultTabsBar from "../../components/ResultTabsBar/ResultTabsBar.tsx"
import { ResultTabOption } from "../../shared/resultTabs.ts"
import { useResultTabs } from "../../shared/useResultTabs.ts"
import { Person } from "@mui/icons-material"
import { useQuery } from "react-query"
import { ProcessedRunnerModel } from "../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../shared/EntityTypes.ts"
import { useParams } from "react-router-dom"
import { useCallback, useMemo } from "react"
import RelayLegs from "./pages/RelayLegs/RelayLegs.tsx"
import { getRelayRunnersByClass, getRelayRunnersByClub } from "./services/RelayService.ts"
import { RESULT_TAB, RESULTS_QUERY } from "../../shared/constants.ts"
import { checkIfEventTimezoneMatchesUser } from "../../../../../../shared/timezoneFunctions.ts"
import { DateTime } from "luxon"
import { useFetchStageDetail } from "../../../../services/FetchHooks.ts"

const RELAY_TABS: readonly ResultTabOption[] = [
  { icon: <EmojiEventsIcon />, key: RESULT_TAB.Results, labelKey: "StageHeader.Results" },
  { icon: <Person />, key: RESULT_TAB.Legs, labelKey: "StageHeader.RelayLegs" },
]

export default function Relay() {
  // Get stage's and event's ids
  const { eventId, stageId } = useParams()
  if (!eventId || !stageId) {
    throw new Error("Event Id or Stage Id is missing")
  }

  const { data: stageData, eventData } = useFetchStageDetail(eventId, stageId, {
    staleTime: Infinity,
  })

  const timezoneMatch = useMemo(() => {
    if (!stageData?.start || !eventData?.timezone) {
      return true
    }

    return checkIfEventTimezoneMatchesUser(DateTime.fromISO(stageData.start), eventData.timezone)
  }, [stageData?.start, eventData?.timezone])

  // Fetch classes and clubs
  const {
    activeItem,
    classesQuery,
    clubsQuery,
    isClass,
    setClassClubId,
    refresh: refreshClassesClubs,
  } = useFetchClasses()

  // Fetch runners
  const runnersQueryByClasses = useQuery<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>(
    [eventId, stageId, "results", "classes", activeItem?.id],
    () =>
      activeItem
        ? getRelayRunnersByClass(eventId, stageId, activeItem.id)
        : Promise.reject(new Error("No active class")),
    {
      ...RESULTS_QUERY,
      enabled: !!activeItem && isClass && !!classesQuery.data,
    },
  )

  const runnersQueryByClubs = useQuery<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>(
    [eventId, stageId, "results", "clubs", activeItem?.id],
    () =>
      activeItem
        ? getRelayRunnersByClub(eventId, stageId, activeItem?.id)
        : Promise.reject(new Error("No active club")),
    {
      ...RESULTS_QUERY,
      enabled: !!activeItem && !isClass && !!classesQuery.data,
    },
  )

  const handleRefreshClick = useCallback(() => {
    refreshClassesClubs()
    if (isClass) {
      void runnersQueryByClasses.refetch()
    } else {
      void runnersQueryByClubs.refetch()
    }
  }, [isClass, refreshClassesClubs, runnersQueryByClasses, runnersQueryByClubs])

  const { selectedMenu, handleMenuChange } = useResultTabs(0, RELAY_TABS)

  return (
    <Box sx={{ px: 2, height: "100%" }}>
      <StageLayout
        key={"stageLayout"}
        activeItem={activeItem}
        isClass={isClass}
        classesQuery={classesQuery}
        clubsQuery={clubsQuery}
        setActiveClassClub={setClassClubId}
        handleRefreshClick={handleRefreshClick}
        displayTimezoneMsg={!timezoneMatch}
        isFetching={runnersQueryByClasses.isFetching || runnersQueryByClasses.isFetching}
        navigation={
          <ResultTabsBar
            options={RELAY_TABS}
            selectedMenu={selectedMenu}
            onChange={handleMenuChange}
          />
        }
      >
        <ResultTabsPanel options={RELAY_TABS} selectedMenu={selectedMenu}>
          <RelayResults
            runnersQuery={isClass ? runnersQueryByClasses : runnersQueryByClubs}
            activeItem={activeItem}
            isClass={isClass}
            setClassClubId={setClassClubId}
          />
          <RelayLegs
            runnersQuery={isClass ? runnersQueryByClasses : runnersQueryByClubs}
            activeItem={activeItem}
            isClass={isClass}
          />
        </ResultTabsPanel>
      </StageLayout>
    </Box>
  )
}
