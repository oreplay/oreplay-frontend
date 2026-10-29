import TotalsResults from "./pages/TotalsResults/TotalsResults.tsx"
import StageLayout from "../../components/StageLayout/StageLayout.tsx"
import { useFetchClasses } from "../../../../shared/hooks.ts"
import { useQuery } from "react-query"
import { ProcessedRunnerModel } from "../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../shared/EntityTypes.ts"
import { useParams } from "react-router-dom"
import { getTotalsByClass, getTotalsByClub } from "./services/TotalsService.ts"
import { Box } from "@mui/material"
import { useRefreshStage } from "../../shared/useRefreshStage.ts"

export default function Totals() {
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
        ? getTotalsByClass(eventId, stageId, activeItem.id)
        : Promise.reject(new Error("No active class")),
    {
      enabled: !!activeItem && isClass,
      refetchOnWindowFocus: false,
    },
  )

  const runnersQueryByClubs = useQuery<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>(
    ["results", "clubs", activeItem?.id],
    () =>
      activeItem
        ? getTotalsByClub(eventId, stageId, activeItem.id)
        : Promise.reject(new Error("No active class")),
    {
      enabled: !!activeItem && !isClass,
      refetchOnWindowFocus: false,
    },
  )

  const shownRunnersQuery = isClass ? runnersQueryByClasses : runnersQueryByClubs
  const refresh = useRefreshStage({
    activeItem,
    eventId,
    refreshClassesClubs,
    shownRunnersQuery,
  })

  return (
    <Box sx={{ px: 3, height: "100%" }}>
      <StageLayout
        key={"stageLayout"}
        activeItem={activeItem}
        isClass={isClass}
        classesQuery={classesQuery}
        clubsQuery={clubsQuery}
        setActiveClassClub={setClassClubId}
        onRefresh={refresh}
        isFetching={shownRunnersQuery.isFetching}
      >
        <TotalsResults runnersQuery={shownRunnersQuery} activeItem={activeItem} isClass={isClass} />
      </StageLayout>
    </Box>
  )
}
