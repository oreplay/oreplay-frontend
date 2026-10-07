import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import {
  transformRunnersForBarChart,
  transformRunnersForLineChart,
  transformRunnersForPositionChart,
} from "../../../shared/chartDataTransform.ts"
import { analyzeTimeLoss } from "../../../shared/timeLossAnalysis.ts"
import { GRAPH_VIEW, GraphView } from "../shared/graphViews.ts"
import BarChart from "./Charts/BarChart.tsx"
import LineChart from "./Charts/LineChart.tsx"
import PositionChart from "./Charts/PositionChart.tsx"

const GRAPH_HEIGHT = 400

interface SelectedGraphProps {
  runners: ProcessedRunnerModel[]
  selectedRunnerIds: string[]
  timeLossThreshold: number
  view: GraphView
}

export default function SelectedGraph({
  runners,
  selectedRunnerIds,
  timeLossThreshold,
  view,
}: SelectedGraphProps) {
  const { t } = useTranslation()

  const timeLossResults = useMemo(
    () => analyzeTimeLoss(runners, timeLossThreshold),
    [runners, timeLossThreshold],
  )

  const lineChartData = useMemo(
    () =>
      view === GRAPH_VIEW.LineChart
        ? transformRunnersForLineChart(runners, selectedRunnerIds, t)
        : [],
    [view, runners, selectedRunnerIds, t],
  )

  const barChartData = useMemo(
    () =>
      view === GRAPH_VIEW.BarChart
        ? transformRunnersForBarChart(runners, selectedRunnerIds, timeLossResults)
        : [],
    [view, runners, selectedRunnerIds, timeLossResults],
  )

  const positionChartData = useMemo(
    () =>
      view === GRAPH_VIEW.PositionChart
        ? transformRunnersForPositionChart(runners, selectedRunnerIds, t)
        : [],
    [view, runners, selectedRunnerIds, t],
  )

  switch (view) {
    case GRAPH_VIEW.BarChart:
      return <BarChart data={barChartData} height={GRAPH_HEIGHT} />
    case GRAPH_VIEW.LineChart:
      return <LineChart data={lineChartData} height={GRAPH_HEIGHT} />
    case GRAPH_VIEW.PositionChart:
      return <PositionChart data={positionChartData} height={GRAPH_HEIGHT} />
  }
}
