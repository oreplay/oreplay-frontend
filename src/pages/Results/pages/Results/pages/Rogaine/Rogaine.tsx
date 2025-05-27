import { useTranslation } from "react-i18next"
import StageLayout from "../../components/Layout/StageLayout.tsx"
import ResultTabs from "../../components/ResultTabs.tsx"
import { BottomNavigationAction } from "@mui/material"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import TimelineIcon from "@mui/icons-material/Timeline"
import RogaineResults from "./pages/RogaineResults/RogaineResults.tsx"
import RogainePoints from "./pages/RogainePoints/RogainePoints.tsx"
import { useFetchClasses } from "../../../../shared/hooks.ts"
import { useParams } from "react-router-dom"
import { getRoganineRunnersByClass, getRoganineRunnersByClub } from "./services/RogaineService.ts"
import { useQuery } from "react-query"
import { ProcessedRunnerModel } from "../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../shared/EntityTypes.ts"
import { useCallback } from "react"

const menu_options_labels = ["results", "points"]

export default function Rogaine() {
  const { t } = useTranslation()

  // Get stage's and event's ids
  const { eventId, stageId } = useParams()
  if (!eventId || !stageId) {
    throw new Error("Event Id or Stage Id is missing")
  }

  // Get classes
  const {
    activeItem,
    classesQuery,
    clubsQuery,
    isClass,
    setClassClubId,
    refresh: refreshClassesClubs,
  } = useFetchClasses()

  // Fetch runners
  const runnersQueryByClasses = useQuery<
    [ProcessedRunnerModel[], bigint[]],
    AxiosError<RunnerModel[]>
  >(
    [eventId, stageId, "results", "classes", activeItem?.id],
    () => (activeItem ? getRoganineRunnersByClass(eventId, stageId, activeItem.id) : [[], []]),
    {
      enabled: !!activeItem && isClass,
      refetchOnWindowFocus: false,
    },
  )

  const runnersQueryByClubs = useQuery<
    [ProcessedRunnerModel[], bigint[]],
    AxiosError<RunnerModel[]>
  >(
    [eventId, stageId, "results", "clubs", activeItem?.id],
    () => (activeItem ? getRoganineRunnersByClub(eventId, stageId, activeItem.id) : [[], []]),
    {
      enabled: !!activeItem && !isClass,
      refetchOnWindowFocus: false,
    },
  )

  // Handle re-fetching
  const handleRefreshClick = useCallback(() => {
    refreshClassesClubs()

    if (isClass) {
      void runnersQueryByClasses.refetch()
    } else {
      void runnersQueryByClubs.refetch()
    }
  }, [refreshClassesClubs, runnersQueryByClasses, runnersQueryByClubs, isClass])

  return (
    <StageLayout
      handleRefreshClick={handleRefreshClick}
      activeItem={activeItem}
      isClass={isClass}
      classesQuery={classesQuery}
      clubsQuery={clubsQuery}
      setActiveClassClub={setClassClubId}
    >
      <ResultTabs
        defaultMenu={0}
        menuOptions={[
          <BottomNavigationAction
            key={"rogaineRseultsMenu"}
            label={t("StageHeader.Results")}
            icon={<EmojiEventsIcon />}
          />,
          <BottomNavigationAction
            key={"RogaineScorePointsMenu"}
            label={t("StageHeader.ScorePoints")}
            icon={<TimelineIcon />}
          />,
        ]}
        menuOptionsLabels={menu_options_labels}
      >
        <RogaineResults
          runnersQuery={isClass ? runnersQueryByClasses : runnersQueryByClubs}
          activeItem={activeItem}
          isClass={isClass}
        />
        <RogainePoints
          runnersQuery={isClass ? runnersQueryByClasses : runnersQueryByClubs}
          activeItem={activeItem}
          isClass={isClass}
        />
      </ResultTabs>
    </StageLayout>
  )
}
