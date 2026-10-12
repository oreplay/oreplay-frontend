import { useEffect, useMemo, useState } from "react"
import { AxiosError } from "axios"
import { Box } from "@mui/material"
import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import ChooseClassMsg from "../../../../components/ChooseClassMsg.tsx"
import GeneralErrorFallback from "../../../../../../../../components/GeneralErrorFallback.tsx"
import GeneralSuspenseFallback from "../../../../../../../../components/GeneralSuspenseFallback.tsx"
import { hasChipDownload } from "../../../../shared/functions.ts"
import useResultsStickyTopPx from "../../../../shared/useResultsStickyTopPx.ts"
import NoRunnerWithSplitsMsg from "../../components/NoRunnerWithSplitsMsg.tsx"
import OnlyForClassesMsg from "../../components/OnlyForClassesMsg.tsx"
import { sortFootORunners } from "../../shared/functions.ts"
import GraphsToolbar from "./components/GraphsToolbar/GraphsToolbar.tsx"
import GraphsViewContent from "./components/GraphsViewContent.tsx"
import { DEFAULT_GRAPH_VIEW, GraphView } from "./shared/graphViews.ts"

export default function FootOGraphs(
  props: ResultsPageProps<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>,
) {
  const runners = useMemo(() => props.runnersQuery.data ?? [], [props.runnersQuery.data])
  const [selectedView, setSelectedView] = useState<GraphView>(DEFAULT_GRAPH_VIEW)
  const stickyTopPx = useResultsStickyTopPx()

  useEffect(() => {
    sortFootORunners(runners)
  }, [runners])

  if (!props.activeItem) return <ChooseClassMsg />
  if (!props.isClass)
    return (
      <Box sx={{ px: 2 }}>
        <OnlyForClassesMsg />
      </Box>
    )
  if (props.runnersQuery.isFetching) return <GeneralSuspenseFallback />
  if (props.runnersQuery.isError) return <GeneralErrorFallback />

  const hasRunnersWithSplits = runners.some((runner) => hasChipDownload(runner))

  return (
    <Box>
      <GraphsToolbar
        selectedView={selectedView}
        onViewChange={setSelectedView}
        stickyTopPx={stickyTopPx}
      />
      {hasRunnersWithSplits ? (
        <GraphsViewContent runners={runners} view={selectedView} />
      ) : (
        <NoRunnerWithSplitsMsg />
      )}
    </Box>
  )
}
