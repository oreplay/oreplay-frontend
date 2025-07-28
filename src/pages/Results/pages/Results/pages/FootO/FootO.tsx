import StageLayout from "../../components/Layout/StageLayout.tsx"
import ResultTabs from "../../components/ResultTabs.tsx"
import { BottomNavigationAction } from "@mui/material"
import { AccessTime } from "@mui/icons-material"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import TimerIcon from "@mui/icons-material/Timer"
import { useTranslation } from "react-i18next"
import FootOStartTime from "./pages/StartTime/FootOStartTime.tsx"
import FootOResults from "./pages/Results/FootOResults.tsx"
import FootOSplits from "./pages/Splits/FootOSplits.tsx"
import { useFetchClasses } from "../../../../shared/hooks.ts"
import { useCallback } from "react"
import { useQuery } from "react-query"
import { getFootORunnersByClass, getFootORunnersByClub } from "./services/FootOService.ts"
import { useParams } from "react-router-dom"
import { ProcessedRunnerModel } from "../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../shared/EntityTypes.ts"

const menu_options_labels = ["startTimes", "results", "splits"]

export default function FootO() {
  const { t } = useTranslation()

  // Get stage's and event's ids
  const { eventId, stageId } = useParams()
  if (!eventId || !stageId) {
    throw new Error("Event Id or Stage Id is missing")
  }

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
    [eventId, stageId, "results", "classes", activeItem?.id],
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

  return (
    <StageLayout
      key={"stageLayout"}
      activeItem={activeItem}
      isClass={isClass}
      classesQuery={classesQuery}
      clubsQuery={clubsQuery}
      setActiveClassClub={setClassClubId}
      handleRefreshClick={refetch}
    >
      <ResultTabs
        key={"ResultTabs"}
        defaultMenu={1}
        menuOptions={[
          <BottomNavigationAction
            key={"FootOStartTimeMenu"}
            label={t("StageHeader.StartTime")}
            icon={<AccessTime />}
          />,
          <BottomNavigationAction
            key={"FootOResultsMenu"}
            label={t("StageHeader.Results")}
            icon={<EmojiEventsIcon />}
          />,
          <BottomNavigationAction
            key={"FootOSplitsMenu"}
            label={t("StageHeader.Splits")}
            icon={<TimerIcon />}
          />,
        ]}
        menuOptionsLabels={menu_options_labels}
      >
        <FootOStartTime
          runnersQuery={isClass ? runnersQueryByClasses : runnersQueryByClubs}
          activeItem={activeItem}
          isClass={isClass}
        />
        <FootOResults
          runnersQuery={isClass ? runnersQueryByClasses : runnersQueryByClubs}
          activeItem={activeItem}
          isClass={isClass}
          setClassClubId={setClassClubId}
        />
        <FootOSplits
          runnersQuery={isClass ? runnersQueryByClasses : runnersQueryByClubs}
          activeItem={activeItem}
          isClass={isClass}
        />
      </ResultTabs>
    </StageLayout>
  )
}
