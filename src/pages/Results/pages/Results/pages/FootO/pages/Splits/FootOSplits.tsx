import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import FootOSplitsTable from "./components/FootOSplitsTable/FootOSplitsTable.tsx"
import ChooseClassMsg from "../../../../components/ChooseClassMsg.tsx"
import GeneralErrorFallback from "../../../../../../../../components/GeneralErrorFallback.tsx"
import GeneralSuspenseFallback from "../../../../../../../../components/GeneralSuspenseFallback.tsx"
import { useState, useMemo } from "react"
import { FormControlLabel, Switch, Box, Typography, Slider, Button } from "@mui/material"
import { BarChart as BarChartIcon } from "@mui/icons-material"
import ExperimentalFeatureAlert from "../../../../../../../../components/ExperimentalFeatureAlert.tsx"
import PartialCumulativeSwitch from "./components/PartialCumulativeSwitch.tsx"
import OnlyForClassesMsg from "./components/OnlyForClassesMsg.tsx"
import GraphSelectionModal, { GraphType } from "./components/GraphSelection/GraphSelectionModal.tsx"
import LineChart from "./components/Charts/LineChart.tsx"
import BarChart from "./components/Charts/BarChart.tsx"
import BoxPlotChart from "./components/Charts/BoxPlotChart.tsx"
import PositionChart from "./components/Charts/PositionChart.tsx"
import HeatmapChart from "./components/Charts/HeatmapChart.tsx"
import {
  transformRunnersForLineChart,
  transformRunnersForBarChart,
  transformRunnersForBoxPlot,
  transformRunnersForPositionChart,
  transformRunnersForHeatmap,
} from "./components/utils/chartDataTransform.ts"
import { analyzeTimeLoss, TimeLossResults } from "./components/utils/timeLossAnalysis.ts"

// The main part that renders Foot-O splits results and related controls/graphs
export default function FootOSplits(
  props: ResultsPageProps<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>,
) {
  // State hooks for controlling various UI toggles and selections
  const [onlyRadios, setOnlyRadios] = useState<boolean>(false) // Show only radio controls or all splits
  const [showCumulative, setShowCumulative] = useState<boolean>(false) // Show cumulative times or partial times
  const [showCumulativeDisplayed, setShowCumulativeDisplayed] = useState<boolean>(false) // UI state sync for cumulative switch
  const [timeLossEnabled, setTimeLossEnabled] = useState<boolean>(false) // Enable time loss analysis
  const [timeLossThreshold, setTimeLossThreshold] = useState<number>(15) // Threshold (%) for time loss detection
  const [graphsEnabled, setGraphsEnabled] = useState<boolean>(false) // Enable or disable graph display
  const [graphModalOpen, setGraphModalOpen] = useState<boolean>(false) // Whether the graph selection modal is open
  const [selectedGraphType, setSelectedGraphType] = useState<GraphType | null>(null) // Currently selected graph type (line or bar)
  const [selectedRunners, setSelectedRunners] = useState<string[]>([]) // IDs of runners selected for graph display

  // Shortcut variables for easier access
  const activeItem = props.activeItem
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const runners = props.runnersQuery.data || [] // List of runners from a query, default empty array

  // Memoized calculation of time loss analysis results when a threshold or relevant data changes
  const timeLossResults: TimeLossResults | undefined = useMemo(() => {
    if (!timeLossThreshold) return undefined
    return analyzeTimeLoss(runners, timeLossThreshold, showCumulative)
  }, [runners, timeLossThreshold, showCumulative])

  // Early returns based on app state / loading / error

  // If no class (activeItem) selected, prompt the user to select one
  if (!activeItem) {
    return <ChooseClassMsg />
  }

  // If the current view is not for classes, show a message restricting functionality
  if (!props.isClass) {
    return <OnlyForClassesMsg />
  }

  // Show loading fallback if runners data is still fetching
  if (props.runnersQuery.isFetching) {
    return <GeneralSuspenseFallback />
  }

  // Show error fallback if fetching runner data failed
  if (props.runnersQuery.isError) {
    return <GeneralErrorFallback />
  }

  // Handler to toggle graph display on/off and open/close graph selection modal
  const handleGraphsToggle = () => {
    setGraphsEnabled(!graphsEnabled)
    if (!graphsEnabled) {
      setGraphModalOpen(true)
    } else {
      setSelectedGraphType(null)
      setSelectedRunners([])
    }
  }

  // Handler when user selects graph type in modal
  const handleGraphSelection = (type: GraphType) => {
    setSelectedGraphType(type)
  }

  // Handler when selected runners change (for graph display)
  const handleRunnerSelectionChange = (runners: string[]) => {
    // No restrictions on runner count - support unlimited runners for all chart types
    setSelectedRunners(runners)
  }

  // Prepare data for a line chart if applicable
  const lineChartData =
    selectedGraphType === "line" && selectedRunners.length > 0
      ? transformRunnersForLineChart(runners, selectedRunners)
      : []

  // Prepare data for the bar chart if applicable (unlimited runners supported)
  const barChartData =
    selectedGraphType === "bar" && selectedRunners.length > 0
      ? transformRunnersForBarChart(runners, selectedRunners, timeLossResults)
      : []

  // Debug logging for bar chart data
  if (selectedGraphType === "bar") {
    console.log("Bar Chart Debug Info:", {
      selectedRunners: selectedRunners.length,
      selectedRunnerIds: selectedRunners,
      barChartDataLength: barChartData.length,
      barChartData: barChartData,
      timeLossResults: !!timeLossResults,
    })
  }

  // Prepare data for box plot chart
  const boxPlotData = selectedGraphType === "boxplot" ? transformRunnersForBoxPlot(runners) : []

  // Prepare data for position evolution chart (supports unlimited runners)
  const positionChartData =
    selectedGraphType === "position" && selectedRunners.length > 0
      ? transformRunnersForPositionChart(runners, selectedRunners)
      : []

  // Prepare data for heatmap chart
  const heatmapData =
    selectedGraphType === "heatmap" ? transformRunnersForHeatmap(runners, "position") : []

  return (
    <>
      {/* Experimental feature warning banner */}
      <ExperimentalFeatureAlert />

      {/* Controls section for graph toggling */}
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Button
          variant={graphsEnabled ? "contained" : "outlined"}
          startIcon={<BarChartIcon />}
          onClick={handleGraphsToggle}
          color="primary"
        >
          Gráficos
        </Button>

        {/* Show info about the selected graph and number of runners selected */}
        {graphsEnabled && selectedGraphType && (
          <Typography variant="body2" color="text.secondary">
            {selectedGraphType === "line" && "Gráfico de Líneas"}
            {selectedGraphType === "bar" && "Gráfico de Barras"}
            {selectedGraphType === "boxplot" && "Gráfico de Cajas"}
            {selectedGraphType === "position" && "Evolución de Posición"}
            {selectedGraphType === "heatmap" && "Mapa de Calor"}
            {(selectedGraphType === "line" ||
              selectedGraphType === "boxplot" ||
              selectedGraphType === "heatmap") &&
              selectedRunners.length > 0 && (
                <>
                  {" "}
                  - {selectedRunners.length} corredor{selectedRunners.length !== 1 ? "es" : ""}{" "}
                  seleccionado{selectedRunners.length !== 1 ? "s" : ""}
                </>
              )}
            {(selectedGraphType === "bar" || selectedGraphType === "position") &&
              selectedRunners.length > 0 && (
                <>
                  {" "}
                  - {selectedRunners.length} corredor{selectedRunners.length !== 1 ? "es" : ""}{" "}
                  seleccionado{selectedRunners.length !== 1 ? "s" : ""}
                </>
              )}
            {(selectedGraphType === "bar" || selectedGraphType === "position") &&
              selectedRunners.length === 0 && (
                <span style={{ color: "#f44336" }}> - Selecciona corredores</span>
              )}
          </Typography>
        )}
      </Box>

      {/* Switch to toggle partial vs. cumulative times display */}
      <PartialCumulativeSwitch
        active={showCumulativeDisplayed}
        setActive={(newValue) => {
          setShowCumulative(newValue)
          setShowCumulativeDisplayed(newValue)
        }}
        disabled={onlyRadios}
      />

      {/* If splits exist, show switch to toggle only radio controls or all splits */}
      {"splits" in activeItem && activeItem.splits.length > 0 ? (
        <FormControlLabel
          control={
            <Switch
              value={onlyRadios}
              checked={onlyRadios}
              onChange={() => {
                setOnlyRadios(!onlyRadios)
                // When toggling onlyRadios, update cumulative times UI accordingly
                !onlyRadios
                  ? setShowCumulativeDisplayed(true)
                  : setShowCumulativeDisplayed(showCumulative)
              }}
            />
          }
          label="Radios"
        />
      ) : null}

      {/* Controls for time loss analysis (switch plus slider) shown only if cumulatively not displayed */}
      {!showCumulativeDisplayed && (
        <Box display="flex" alignItems="center" gap={1} mt={1} mb={2}>
          <FormControlLabel
            control={
              <Switch
                value={timeLossEnabled}
                checked={timeLossEnabled}
                onChange={() => setTimeLossEnabled(!timeLossEnabled)}
              />
            }
            label="Análisis de pérdida de Tiempo"
          />

          {/* Slider to adjust a time loss threshold when analysis enabled */}
          {timeLossEnabled && (
            <>
              <Typography
                sx={{
                  minWidth: 80,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  mr: 0.5,
                }}
              >
                Umbral {timeLossThreshold}%:
              </Typography>

              <Box sx={{ width: 120, ml: 0 }}>
                <Slider
                  value={timeLossThreshold}
                  min={5}
                  max={100}
                  step={5}
                  onChange={(_, value) => setTimeLossThreshold(value as number)}
                  aria-label="Time Loss Threshold"
                  size="small"
                  marks
                />
              </Box>
            </>
          )}
        </Box>
      )}

      {/* Render the selected graph with prepared data */}
      {graphsEnabled && selectedGraphType && (
        <Box mb={3}>
          {selectedGraphType === "line" && <LineChart data={lineChartData} height={400} />}
          {selectedGraphType === "bar" && <BarChart data={barChartData} height={400} />}
          {selectedGraphType === "boxplot" && <BoxPlotChart data={boxPlotData} height={400} />}
          {selectedGraphType === "position" && (
            <PositionChart data={positionChartData} height={400} />
          )}
          {selectedGraphType === "heatmap" && <HeatmapChart data={heatmapData} height={400} />}
        </Box>
      )}

      {/* Main splits table displaying runner splits, controls, and selection */}
      <FootOSplitsTable
        onlyRadios={onlyRadios}
        radiosList={"splits" in activeItem ? activeItem.splits : []}
        showCumulative={showCumulative}
        key={"FootOSplitsTable"}
        runners={runners}
        timeLossEnabled={timeLossEnabled}
        timeLossThreshold={timeLossThreshold}
        graphsEnabled={graphsEnabled}
        selectedRunners={selectedRunners}
        selectedGraphType={selectedGraphType}
        onRunnerSelectionChange={handleRunnerSelectionChange}
      />

      {/* Modal dialog to select a graph type */}
      <GraphSelectionModal
        open={graphModalOpen}
        onClose={() => setGraphModalOpen(false)}
        onSelectGraph={handleGraphSelection}
        selectedGraph={selectedGraphType}
      />
    </>
  )
}
