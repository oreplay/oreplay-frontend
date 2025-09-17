import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { useFetchClasses } from "../../../../shared/hooks.ts"
import { useQuery } from "react-query"
import { ProcessedRunnerModel } from "../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../shared/EntityTypes.ts"
import { useCallback } from "react"
import StageLayout from "../../components/Layout/StageLayout.tsx"
import ResultTabs from "../../components/ResultTabs.tsx"
import { BottomNavigationAction, Box } from "@mui/material"
import { AccessTime } from "@mui/icons-material"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import FootOStartTime from "../FootO/pages/StartTime/FootOStartTime.tsx"
import OneManRelayResults from "./pages/OneManRelayResults"
import {
  getOneManRelayRunnersByClass,
  getOneManRelayRunnersByClub,
} from "./services/OneManRelayService.ts"

const menu_options_labels = ["startTimes", "results"]

export default function OneManRelay() {
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
        ? getOneManRelayRunnersByClass(eventId, stageId, activeItem.id, classesQuery.data?.data)
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
        ? getOneManRelayRunnersByClub(eventId, stageId, activeItem?.id, classesQuery.data?.data)
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
            key={"OneManRelayStartTimeMenu"}
            label={t("StageHeader.StartTime")}
            icon={<AccessTime />}
          />,
          <BottomNavigationAction
            key={"OneManRelayResultsMenu"}
            label={t("StageHeader.Results")}
            icon={<EmojiEventsIcon />}
          />,
        ]}
        menuOptionsLabels={menu_options_labels}
      >
        <Box sx={{ px: 2, height: "100%" }}>
          <FootOStartTime
            runnersQuery={isClass ? runnersQueryByClasses : runnersQueryByClubs}
            activeItem={activeItem}
            isClass={isClass}
          />
        </Box>
        <Box sx={{ px: 3, height: "100%" }}>
          <OneManRelayResults
            runnersQuery={isClass ? runnersQueryByClasses : runnersQueryByClubs}
            activeItem={activeItem}
            isClass={isClass}
            setClassClubId={setClassClubId}
          />
        </Box>
      </ResultTabs>
    </StageLayout>
  )
}
