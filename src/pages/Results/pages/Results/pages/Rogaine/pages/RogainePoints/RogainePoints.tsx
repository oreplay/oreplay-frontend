import { Box } from "@mui/material"
import { AxiosError } from "axios"
import ChooseClassMsg from "../../../../components/ChooseClassMsg.tsx"
import ResultsListSkeleton from "../../../../components/ResultsList/ResultListSkeleton.tsx"
import GeneralErrorFallback from "../../../../../../../../components/GeneralErrorFallback.tsx"
import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import useResultsStickyTopPx from "../../../../shared/useResultsStickyTopPx.ts"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import OnlyForClassesMsg from "./components/OnlyForClassesMsg.tsx"
import RogainePointsTable from "./components/RogainePointsTable/RogainePointsTable.tsx"

const NO_RUNNERS: ProcessedRunnerModel[] = []
const NO_CONTROLS: bigint[] = []

/**
 * Points tab of a rogaine stage: the points table of the selected class, or a message when there
 * is no class to show it for.
 *
 * @param props.activeItem Selected class or club; `null` when none is selected yet.
 * @param props.isClass Whether the selected item is a class; the table is only shown for classes.
 * @param props.runnersQuery Query with the class's runners and the station numbers of its controls.
 */
export default function RogainePoints(
  props: ResultsPageProps<[ProcessedRunnerModel[], bigint[]], AxiosError<RunnerModel[]>>,
) {
  const stickyTopPx = useResultsStickyTopPx()
  const [runners, controlStations] = props.runnersQuery.data ?? [NO_RUNNERS, NO_CONTROLS]

  if (!props.activeItem) return <ChooseClassMsg />
  if (!props.isClass)
    return (
      <Box sx={{ px: 2, height: "100%" }}>
        <OnlyForClassesMsg />
      </Box>
    )
  if (props.runnersQuery.isFetching || props.runnersQuery.isLoading)
    return (
      <Box sx={{ px: 2, height: "100%" }}>
        <ResultsListSkeleton />
      </Box>
    )
  if (props.runnersQuery.isError) return <GeneralErrorFallback />

  return (
    <RogainePointsTable
      controlStations={controlStations}
      headerStickyTopPx={stickyTopPx}
      runners={runners}
    />
  )
}
