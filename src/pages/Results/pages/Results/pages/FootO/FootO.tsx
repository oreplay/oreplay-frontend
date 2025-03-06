import StageLayout from "../../components/Layout/StageLayout.tsx"
import ResultTabs from "../../components/ResultTabs.tsx"
//import { useFetchClasses } from "../../../../shared/hooks.ts"
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
import { getFootORunnersByClass } from "./services/FootOService.ts"
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

  // Fetch classes
  const [activeClass, setActiveClassId, classesList, areClassesLoading, refreshClasses] =
    useFetchClasses()

  // Fetch runners
  const runnersQueryByClasses = useQuery<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>(
    ["results", "classes", activeClass?.id],
    () =>
      activeClass
        ? getFootORunnersByClass(eventId, stageId, activeClass.id)
        : Promise.reject(new Error("No active class")),
    {
      enabled: !!activeClass,
      refetchOnWindowFocus: false,
    },
  )

  // Handle re-fetching
  const handleRefreshClick = useCallback(() => {
    refreshClasses()
    void runnersQueryByClasses.refetch()
  }, [refreshClasses, runnersQueryByClasses])

  return (
    <StageLayout
      key={"stageLayout"}
      handleRefreshClick={handleRefreshClick}
      classesList={classesList}
      setActiveClassId={setActiveClassId}
      activeClass={activeClass}
      areClassesLoading={areClassesLoading}
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
        <FootOStartTime runnersQuery={runnersQueryByClasses} activeClass={activeClass} />
        <FootOResults runnersQuery={runnersQueryByClasses} activeClass={activeClass} />
        <FootOSplits runnersQuery={runnersQueryByClasses} activeClass={activeClass} />
      </ResultTabs>
    </StageLayout>
  )
}
