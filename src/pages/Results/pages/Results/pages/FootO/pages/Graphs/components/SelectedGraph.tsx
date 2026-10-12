import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import {
  transformRunnersForLineChart,
  transformRunnersForPositionChart,
} from "../../../shared/chartDataTransform.ts"
import { GRAPH_VIEW, GraphView, lineChartReferenceOf } from "../shared/graphViews.ts"
import LineChart from "./Charts/LineChart.tsx"
import PositionChart from "./Charts/PositionChart.tsx"

const GRAPH_HEIGHT = 400

interface SelectedGraphProps {
  runners: ProcessedRunnerModel[]
  selectedRunnerIds: string[]
  view: GraphView
}

/**
 * Renders the graph the user picked for the selected runners.
 *
 * @param props.runners Runners of the class.
 * @param props.selectedRunnerIds Ids of the runners to plot.
 * @param props.view The graph to show.
 */
export default function SelectedGraph({ runners, selectedRunnerIds, view }: SelectedGraphProps) {
  const { t } = useTranslation()
  const lineChartReference = lineChartReferenceOf(view)

  const lineChartData = useMemo(
    () =>
      lineChartReference
        ? transformRunnersForLineChart(runners, selectedRunnerIds, t, lineChartReference)
        : [],
    [lineChartReference, runners, selectedRunnerIds, t],
  )

  const positionChartData = useMemo(
    () =>
      view === GRAPH_VIEW.PositionChart
        ? transformRunnersForPositionChart(runners, selectedRunnerIds, t)
        : [],
    [view, runners, selectedRunnerIds, t],
  )

  switch (view) {
    case GRAPH_VIEW.LineChart:
    case GRAPH_VIEW.PerfectRunnerChart:
      return <LineChart data={lineChartData} height={GRAPH_HEIGHT} />
    case GRAPH_VIEW.PositionChart:
      return <PositionChart data={positionChartData} height={GRAPH_HEIGHT} />
  }
}
