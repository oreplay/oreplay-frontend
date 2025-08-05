import RelayResults from "./pages/RelayResults/RelayResults.tsx"
import StageLayout from "../../components/Layout/StageLayout.tsx"
import { useFetchClasses } from "../../../../shared/hooks.ts"
import { BottomNavigationAction, Box } from "@mui/material"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import ResultTabs from "../../components/ResultTabs.tsx"
import { useTranslation } from "react-i18next"
import { Person } from "@mui/icons-material"
import { useQuery } from "react-query"
import { ProcessedRunnerModel } from "../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../shared/EntityTypes.ts"
import { useParams } from "react-router-dom"
import { useCallback } from "react"
import RelayLegs from "./pages/RelayLegs/RelayLegs.tsx"
import { getRelayRunnersByClass } from "./services/RelayService.ts"

const menu_options_labels = ["results", "legs"]

export default function Relay() {
  const { t } = useTranslation()

  // Get stage's and event's ids
  const { eventId, stageId } = useParams()
  if (!eventId || !stageId) {
    throw new Error("Event Id or Stage Id is missing")
  }

  const {
    activeItem,
    classesQuery,
    clubsQuery,
    isClass,
    setClassClubId,
    refresh: refreshClassesClubs,
  } = useFetchClasses()

  // Query runners
  const runnersQueryByClasses = useQuery<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>(
    ["results", "classes", activeItem?.id],
    () =>
      activeItem
        ? getRelayRunnersByClass(eventId, stageId, activeItem.id)
        : Promise.reject(new Error("No active class")),
    {
      enabled: !!activeItem && isClass,
      refetchOnWindowFocus: false,
    },
  )

  // Handle re-fetching
  const handleRefreshClick = useCallback(() => {
    refreshClassesClubs()
    void runnersQueryByClasses.refetch()
  }, [refreshClassesClubs, runnersQueryByClasses])

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
      >
        <ResultTabs
          defaultMenu={0}
          menuOptions={[
            <BottomNavigationAction
              key={"relayResults"}
              label={t("StageHeader.Results")}
              icon={<EmojiEventsIcon />}
            />,
            <BottomNavigationAction
              key={"RogaineScorePointsMenu"}
              label={t("StageHeader.RelayLegs")}
              icon={<Person />}
            />,
          ]}
          menuOptionsLabels={menu_options_labels}
        >
          <RelayResults
            runnersQuery={runnersQueryByClasses}
            activeItem={activeItem}
            isClass={isClass}
            setClassClubId={setClassClubId}
          />
          <RelayLegs
            runnersQuery={runnersQueryByClasses}
            activeItem={activeItem}
            isClass={isClass}
          />
        </ResultTabs>
      </StageLayout>
    </Box>
  )
}
