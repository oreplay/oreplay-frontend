import TotalsResults from "./pages/RelayResults/TotalsResults.tsx"
import StageLayout from "../../components/Layout/StageLayout.tsx"
import { useFetchClasses } from "../../../../shared/hooks.ts"
import { useQuery } from "react-query"
import { ProcessedRunnerModel } from "../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../shared/EntityTypes.ts"
import { useParams } from "react-router-dom"
import { useCallback } from "react"
import { getTotalsByClass } from "./services/TotalsService.ts"

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

  // Handle re-fetching
  const handleRefreshClick = useCallback(() => {
    refreshClassesClubs()
    void runnersQueryByClasses.refetch()
  }, [refreshClassesClubs, runnersQueryByClasses])

  return (
    <StageLayout
      key={"stageLayout"}
      activeItem={activeItem}
      isClass={isClass}
      classesQuery={classesQuery}
      clubsQuery={clubsQuery}
      setActiveClassClub={setClassClubId}
      handleRefreshClick={handleRefreshClick}
    >
      <TotalsResults
        runnersQuery={runnersQueryByClasses}
        activeItem={activeItem}
        isClass={isClass}
      />
    </StageLayout>
  )
}
