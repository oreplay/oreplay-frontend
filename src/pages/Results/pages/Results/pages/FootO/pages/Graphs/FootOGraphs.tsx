import { useEffect, useMemo, useState } from "react"
import { AxiosError } from "axios"
import { Box } from "@mui/material"
import { BarChart as BarChartIcon, ShowChart, Timeline } from "@mui/icons-material"
import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import ChooseClassMsg from "../../../../components/ChooseClassMsg.tsx"
import GeneralErrorFallback from "../../../../../../../../components/GeneralErrorFallback.tsx"
import GeneralSuspenseFallback from "../../../../../../../../components/GeneralSuspenseFallback.tsx"
import { hasChipDownload } from "../../../../shared/functions.ts"
import NoRunnerWithSplitsMsg from "../../components/NoRunnerWithSplitsMsg.tsx"
import OnlyForClassesMsg from "../../components/OnlyForClassesMsg.tsx"
import ViewSelector from "../../components/ViewSelector.tsx"
import { sortFootORunners } from "../../shared/functions.ts"
import { ViewOption } from "../../shared/viewOption.ts"
import GraphsViewContent from "./components/GraphsViewContent.tsx"
import { DEFAULT_GRAPH_VIEW, GRAPH_VIEW, GraphView } from "./shared/graphViews.ts"

const GRAPH_VIEW_OPTIONS: readonly ViewOption<GraphView>[] = [
  { icon: <ShowChart />, key: GRAPH_VIEW.LineChart, labelKey: "view.lineChart" },
  { icon: <BarChartIcon />, key: GRAPH_VIEW.BarChart, labelKey: "view.barChart" },
  { icon: <Timeline />, key: GRAPH_VIEW.PositionChart, labelKey: "view.positionChart" },
]

export default function FootOGraphs(
  props: ResultsPageProps<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>,
) {
  const runners = useMemo(() => props.runnersQuery.data ?? [], [props.runnersQuery.data])
  const [selectedView, setSelectedView] = useState<GraphView>(DEFAULT_GRAPH_VIEW)

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
      <ViewSelector
        options={GRAPH_VIEW_OPTIONS}
        selectedView={selectedView}
        onViewChange={setSelectedView}
      />
      {hasRunnersWithSplits ? (
        <GraphsViewContent runners={runners} view={selectedView} />
      ) : (
        <NoRunnerWithSplitsMsg />
      )}
    </Box>
  )
}
