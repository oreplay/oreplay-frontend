import StageLayout from "../../components/StageLayout/StageLayout.tsx"
import ResultTabsPanel from "../../components/ResultTabsPanel.tsx"
import ResultTabsBar from "../../components/ResultTabsBar/ResultTabsBar.tsx"
import { ResultTabOption } from "../../shared/resultTabs.ts"
import { useResultTabs } from "../../shared/useResultTabs.ts"
import { Box } from "@mui/material"
import { AccessTime } from "@mui/icons-material"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import TimerIcon from "@mui/icons-material/Timer"
import FootOStartTime from "./pages/StartTime/FootOStartTime.tsx"
import FootOResults from "./pages/Results/FootOResults.tsx"
import FootOSplits from "./pages/Splits/FootOSplits.tsx"
import { useFetchClasses } from "../../../../shared/hooks.ts"
import { useCallback, useMemo } from "react"
import { useQuery } from "react-query"
import { getFootORunnersByClass, getFootORunnersByClub } from "./services/FootOService.ts"
import { useParams } from "react-router-dom"
import { ProcessedRunnerModel } from "../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../shared/EntityTypes.ts"
import { useFetchStageDetail } from "../../../../services/FetchHooks.ts"
import { DateTime } from "luxon"
import { checkIfEventTimezoneMatchesUser } from "../../../../../../shared/timezoneFunctions.ts"
import { RESULT_TAB } from "../../shared/constants.ts"

const FOOT_O_TABS: readonly ResultTabOption[] = [
  { icon: <AccessTime />, key: RESULT_TAB.StartTimes, labelKey: "StageHeader.StartTime" },
  { icon: <EmojiEventsIcon />, key: RESULT_TAB.Results, labelKey: "StageHeader.Results" },
  { icon: <TimerIcon />, key: RESULT_TAB.Splits, labelKey: "StageHeader.Splits" },
]

export default function FootO() {
  // Get stage's and event's ids
  const { eventId, stageId } = useParams()
  if (!eventId || !stageId) {
    throw new Error("Event Id or Stage Id is missing")
  }

  const { data: eventDetail, eventData } = useFetchStageDetail(eventId, stageId, {
    staleTime: Infinity,
  })

  const timezoneMatch = useMemo(() => {
    if (!eventDetail?.start || !eventData?.timezone) {
      return true
    }

    return checkIfEventTimezoneMatchesUser(DateTime.fromISO(eventDetail.start), eventData.timezone)
  }, [eventDetail?.start, eventData?.timezone])

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
        ? getFootORunnersByClass(eventId, stageId, activeItem.id, classesQuery.data?.data)
        : Promise.reject(new Error("No active class")),
    {
      enabled: !!activeItem && isClass && !!classesQuery.data,
      refetchOnWindowFocus: false,
    },
  )

  const runnersQueryByClubs = useQuery<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>(
    [eventId, stageId, "results", "clubs", activeItem?.id],
    () =>
      activeItem
        ? getFootORunnersByClub(eventId, stageId, activeItem?.id, classesQuery.data?.data)
        : Promise.reject(new Error("No active club")),
    {
      enabled: !!activeItem && !isClass && !!classesQuery.data,
      refetchOnWindowFocus: false,
    },
  )

  const refetch = useCallback(() => {
    refreshClassesClubs()
    if (isClass) {
      void runnersQueryByClasses.refetch()
    } else {
      void runnersQueryByClubs.refetch()
    }
  }, [isClass, refreshClassesClubs, runnersQueryByClasses, runnersQueryByClubs])

  const { selectedMenu, handleMenuChange } = useResultTabs(
    eventDetail?.start ? (DateTime.fromISO(eventDetail?.start) <= DateTime.now() ? 1 : 0) : 1, // display start times if the race has not started
    FOOT_O_TABS,
  )

  return (
    <StageLayout
      key={"stageLayout"}
      activeItem={activeItem}
      isClass={isClass}
      classesQuery={classesQuery}
      clubsQuery={clubsQuery}
      setActiveClassClub={setClassClubId}
      handleRefreshClick={refetch}
      displayTimezoneMsg={!timezoneMatch}
      isFetching={runnersQueryByClasses.isFetching || runnersQueryByClubs.isFetching}
      navigation={
        <ResultTabsBar
          options={FOOT_O_TABS}
          selectedMenu={selectedMenu}
          onChange={handleMenuChange}
        />
      }
    >
      <ResultTabsPanel key={"ResultTabs"} options={FOOT_O_TABS} selectedMenu={selectedMenu}>
        <Box sx={{ px: 1, height: "100%" }}>
          <FootOStartTime
            runnersQuery={isClass ? runnersQueryByClasses : runnersQueryByClubs}
            activeItem={activeItem}
            isClass={isClass}
          />
        </Box>
        <Box sx={{ px: 1, height: "100%" }}>
          <FootOResults
            runnersQuery={isClass ? runnersQueryByClasses : runnersQueryByClubs}
            activeItem={activeItem}
            isClass={isClass}
            setClassClubId={setClassClubId}
          />
        </Box>
        <FootOSplits
          runnersQuery={isClass ? runnersQueryByClasses : runnersQueryByClubs}
          activeItem={activeItem}
          isClass={isClass}
        />
      </ResultTabsPanel>
    </StageLayout>
  )
}
