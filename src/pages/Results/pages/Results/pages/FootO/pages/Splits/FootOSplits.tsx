import { useState, useMemo, useEffect } from "react"
import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import FootOSplitsTable from "./components/FootOSplitsTable/FootOSplitsTable.tsx"
import ChooseClassMsg from "../../../../components/ChooseClassMsg.tsx"
import GeneralErrorFallback from "../../../../../../../../components/GeneralErrorFallback.tsx"
import GeneralSuspenseFallback from "../../../../../../../../components/GeneralSuspenseFallback.tsx"
import {
  FormControlLabel,
  Switch,
  Box,
  useTheme,
  useMediaQuery,
  Slider,
  Typography,
} from "@mui/material"
import ExperimentalFeatureAlert from "../../../../../../../../components/ExperimentalFeatureAlert.tsx"
import OnlyForClassesMsg from "./components/OnlyForClassesMsg.tsx"
import { analyzeTimeLoss, TimeLossResults } from "./components/utils/timeLossAnalysis.ts"
import ViewSelector, { ViewType } from "./components/ViewSelector.tsx"
import LineChart from "./components/Charts/LineChart.tsx"
import BarChart from "./components/Charts/BarChart.tsx"
import PositionChart from "./components/Charts/PositionChart.tsx"
import CompactRunnerTable from "../Graphs/components/CompactRunnerTable.tsx"
import {
  transformRunnersForLineChart,
  transformRunnersForBarChart,
  transformRunnersForPositionChart,
} from "./components/utils/chartDataTransform.ts"

export default function FootOSplits(
  props: ResultsPageProps<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>,
) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const [selectedView, setSelectedView] = useState<ViewType>("splits")
  const [onlyRadios, setOnlyRadios] = useState<boolean>(false)
  const [showCumulative, setShowCumulative] = useState<boolean>(false)
  const [, setShowCumulativeDisplayed] = useState<boolean>(false)
  const [timeLossThreshold, setTimeLossThreshold] = useState<number>(15)
  const [selectedRunners, setSelectedRunners] = useState<string[]>([])

  const activeItem = props.activeItem
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const runners = props.runnersQuery.data || []

  useEffect(() => {
    const saved = localStorage.getItem("selectedRunners")
    if (saved) {
      try {
        const parsedRunners = JSON.parse(saved) as string[]
        setSelectedRunners(parsedRunners)
      } catch (error) {
        console.error("Error parsing saved runners:", error)
      }
    }
  }, [])

  useEffect(() => {
    if (runners.length > 0 && selectedRunners.length === 0) {
      const topRunners = runners
        .filter((runner) => runner.stage.position && runner.stage.position <= 5)
        .sort((a, b) => (a.stage.position || 0) - (b.stage.position || 0))
        .slice(0, 5)
        .map((runner) => runner.id)
      setSelectedRunners(topRunners)
    }
  }, [runners, selectedRunners.length])

  useEffect(() => {
    if (selectedRunners.length > 0) {
      localStorage.setItem("selectedRunners", JSON.stringify(selectedRunners))
    }
  }, [selectedRunners])

  const handleViewChange = (view: ViewType) => {
    setSelectedView(view)
    switch (view) {
      case "splits":
        setShowCumulative(false)
        setShowCumulativeDisplayed(false)
        break
      case "accumulated":
        setShowCumulative(true)
        setShowCumulativeDisplayed(true)
        break
      case "timeLoss":
        setShowCumulative(false)
        setShowCumulativeDisplayed(false)
        break
    }
  }

  const timeLossResults: TimeLossResults | undefined = useMemo(() => {
    if (!timeLossThreshold) return undefined
    return analyzeTimeLoss(runners, timeLossThreshold, showCumulative)
  }, [runners, timeLossThreshold, showCumulative])

  const lineChartData = useMemo(() => {
    return selectedView === "lineChart" && selectedRunners.length > 0
      ? transformRunnersForLineChart(runners, selectedRunners)
      : []
  }, [selectedView, runners, selectedRunners])

  const barChartData = useMemo(() => {
    return selectedView === "barChart" && selectedRunners.length > 0
      ? transformRunnersForBarChart(runners, selectedRunners, timeLossResults)
      : []
  }, [selectedView, runners, selectedRunners, timeLossResults])

  const positionChartData = useMemo(() => {
    return selectedView === "positionChart" && selectedRunners.length > 0
      ? transformRunnersForPositionChart(runners, selectedRunners)
      : []
  }, [selectedView, runners, selectedRunners])

  const handleRunnerSelectionChange = (runnerIds: string[]) => {
    setSelectedRunners(runnerIds)
  }

  if (!activeItem) return <ChooseClassMsg />
  if (!props.isClass) return <OnlyForClassesMsg />
  if (props.runnersQuery.isFetching) return <GeneralSuspenseFallback />
  if (props.runnersQuery.isError) return <GeneralErrorFallback />

  const RadiosSwitch = () =>
    "splits" in activeItem && activeItem.splits.length > 0 ? (
      <FormControlLabel
        control={
          <Switch
            value={onlyRadios}
            checked={onlyRadios}
            onChange={() => {
              setOnlyRadios(!onlyRadios)
              !onlyRadios
                ? setShowCumulativeDisplayed(true)
                : setShowCumulativeDisplayed(showCumulative)
            }}
          />
        }
        label="Radios"
      />
    ) : null

  const renderSplitsView = () => (
    <Box>
      <ExperimentalFeatureAlert />
      <RadiosSwitch />
      <FootOSplitsTable
        onlyRadios={onlyRadios}
        radiosList={"splits" in activeItem ? activeItem.splits : []}
        showCumulative={showCumulative}
        key={"FootOSplitsTable"}
        runners={runners}
        timeLossEnabled={false}
        timeLossThreshold={timeLossThreshold}
        timeLossResults={undefined}
      />
    </Box>
  )

  const renderAccumulatedView = () => (
    <Box>
      <ExperimentalFeatureAlert />
      <RadiosSwitch />
      <FootOSplitsTable
        onlyRadios={onlyRadios}
        radiosList={"splits" in activeItem ? activeItem.splits : []}
        showCumulative={true}
        key={"FootOSplitsTableAccumulated"}
        runners={runners}
        timeLossEnabled={false}
        timeLossThreshold={timeLossThreshold}
        timeLossResults={undefined}
      />
    </Box>
  )

  const renderTimeLossView = () => (
    <Box>
      <ExperimentalFeatureAlert />
      <RadiosSwitch />

      <Box mt={2} mb={2} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography>Umbral ({timeLossThreshold}%):</Typography>
        <Slider
          size="small"
          value={timeLossThreshold}
          min={5}
          max={100}
          step={5}
          marks
          onChange={(_, newValue) => {
            if (typeof newValue === "number") {
              setTimeLossThreshold(newValue)
            }
          }}
          sx={{ maxWidth: 125 }}
        />
      </Box>

      <FootOSplitsTable
        onlyRadios={onlyRadios}
        radiosList={"splits" in activeItem ? activeItem.splits : []}
        showCumulative={false}
        key={"FootOSplitsTableTimeLoss"}
        runners={runners}
        timeLossEnabled={true}
        timeLossThreshold={timeLossThreshold}
        timeLossResults={timeLossResults}
      />
    </Box>
  )

  const renderChartView = () => (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 2,
          flex: 1,
          minHeight: 0,
        }}
      >
        <Box sx={{ flex: 1, minHeight: 400, order: isMobile ? 2 : 1 }}>
          {selectedView === "lineChart" && <LineChart data={lineChartData} height={400} />}
          {selectedView === "barChart" && <BarChart data={barChartData} height={400} />}
          {selectedView === "positionChart" && (
            <PositionChart data={positionChartData} height={400} />
          )}
        </Box>
        <Box
          sx={{
            width: isMobile ? "100%" : "auto",
            height: 400,
            overflowY: "auto",
            overflowX: "hidden",
            order: isMobile ? 1 : 2,
          }}
        >
          <CompactRunnerTable
            runners={runners}
            selectedRunners={selectedRunners}
            onSelectionChange={handleRunnerSelectionChange}
          />
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box>
      <ViewSelector selectedView={selectedView} onViewChange={handleViewChange} />
      {selectedView === "splits" && renderSplitsView()}
      {selectedView === "accumulated" && renderAccumulatedView()}
      {selectedView === "timeLoss" && renderTimeLossView()}
      {(selectedView === "lineChart" ||
        selectedView === "barChart" ||
        selectedView === "positionChart") &&
        renderChartView()}
    </Box>
  )
}
