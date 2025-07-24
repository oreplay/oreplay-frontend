import React, { useState, useEffect, useMemo } from "react"
import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import ChooseClassMsg from "../../../../components/ChooseClassMsg.tsx"
import GeneralErrorFallback from "../../../../../../../../components/GeneralErrorFallback.tsx"
import GeneralSuspenseFallback from "../../../../../../../../components/GeneralSuspenseFallback.tsx"
import OnlyForClassesMsg from "../Splits/components/OnlyForClassesMsg.tsx"
import {
  Box,
  Typography,
  Paper,
  Tab,
  Tabs,
  useTheme,
  useMediaQuery,
  FormControlLabel,
  Switch,
  Slider,
} from "@mui/material"
import { useTranslation } from "react-i18next"
import LineChart from "../Splits/components/Charts/LineChart.tsx"
import BarChart from "../Splits/components/Charts/BarChart.tsx"
import PositionChart from "../Splits/components/Charts/PositionChart.tsx"
import {
  transformRunnersForLineChart,
  transformRunnersForBarChart,
  transformRunnersForPositionChart,
} from "../Splits/components/utils/chartDataTransform.ts"
import { analyzeTimeLoss, TimeLossResults } from "../Splits/components/utils/timeLossAnalysis.ts"
import CompactRunnerTable from "./components/CompactRunnerTable.tsx"
import { ShowChart, BarChart as BarChartIcon, Timeline } from "@mui/icons-material"

export type GraphType = "line" | "bar" | "position"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`chart-tabpanel-${index}`}
      aria-labelledby={`chart-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  )
}

export default function FootOGraphs(
  props: ResultsPageProps<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>,
) {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  // State for chart type selection
  const [selectedGraphType, setSelectedGraphType] = useState<GraphType>("line")

  // State for runner selection - initialize empty, will fill later
  const [selectedRunners, setSelectedRunners] = useState<string[]>([])

  // State for time loss analysis
  const [timeLossEnabled, setTimeLossEnabled] = useState<boolean>(false)
  const [timeLossThreshold, setTimeLossThreshold] = useState<number>(15)

  // Shortcut variables
  const activeItem = props.activeItem
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const runners = props.runnersQuery.data || []

  // Load saved selection from localStorage ONCE on mount
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

  // If no selection loaded from localStorage, initialize top 5 runners by position
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

  // Save selected runners to localStorage whenever it changes
  useEffect(() => {
    if (selectedRunners.length > 0) {
      localStorage.setItem("selectedRunners", JSON.stringify(selectedRunners))
    }
  }, [selectedRunners])

  // Time loss analysis memo
  const timeLossResults: TimeLossResults | undefined = useMemo(() => {
    if (!timeLossThreshold) return undefined
    return analyzeTimeLoss(runners, timeLossThreshold, false)
  }, [runners, timeLossThreshold])

  if (!activeItem) {
    return <ChooseClassMsg />
  }

  if (!props.isClass) {
    return <OnlyForClassesMsg />
  }

  if (props.runnersQuery.isFetching) {
    return <GeneralSuspenseFallback />
  }

  if (props.runnersQuery.isError) {
    return <GeneralErrorFallback />
  }

  // Prepare chart data based on selected type
  const lineChartData =
    selectedGraphType === "line" && selectedRunners.length > 0
      ? transformRunnersForLineChart(runners, selectedRunners)
      : []

  const barChartData =
    selectedGraphType === "bar" && selectedRunners.length > 0
      ? transformRunnersForBarChart(
          runners,
          selectedRunners,
          timeLossEnabled ? timeLossResults : undefined,
        )
      : []

  const positionChartData =
    selectedGraphType === "position" && selectedRunners.length > 0
      ? transformRunnersForPositionChart(runners, selectedRunners)
      : []

  // Handle tab change
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    const graphTypes: GraphType[] = ["line", "bar", "position"]
    setSelectedGraphType(graphTypes[newValue])
  }

  // Handle runner selection changes from table
  const handleRunnerSelectionChange = (runnerIds: string[]) => {
    setSelectedRunners(runnerIds)
  }

  const tabIndex = selectedGraphType === "line" ? 0 : selectedGraphType === "bar" ? 1 : 2

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Chart type selector */}
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ minHeight: 48 }}
        >
          <Tab
            icon={<ShowChart />}
            label={t("Graphs.LineChart")}
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
          <Tab
            icon={<BarChartIcon />}
            label={t("Graphs.BarChart")}
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
          <Tab
            icon={<Timeline />}
            label={t("Graphs.PositionChart")}
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
        </Tabs>
      </Paper>

      {/* Time loss controls for bar chart */}
      {selectedGraphType === "bar" && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={timeLossEnabled}
                  onChange={() => setTimeLossEnabled(!timeLossEnabled)}
                />
              }
              label={t("Graphs.TimeLossAnalysis")}
            />

            {timeLossEnabled && (
              <>
                <Typography sx={{ minWidth: 80, whiteSpace: "nowrap", ml: 2 }}>
                  {t("Graphs.Threshold")} {timeLossThreshold}%:
                </Typography>
                <Box sx={{ width: 120, ml: 1 }}>
                  <Slider
                    value={timeLossThreshold}
                    min={5}
                    max={100}
                    step={5}
                    onChange={(_, value) => setTimeLossThreshold(value as number)}
                    size="small"
                    marks
                  />
                </Box>
              </>
            )}
          </Box>
        </Paper>
      )}

      {/* Chart and runner selection layout */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 2,
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Chart area */}
        <Box
          sx={{
            flex: 1,
            minHeight: 400,
            order: isMobile ? 2 : 1,
          }}
        >
          <TabPanel value={tabIndex} index={0}>
            <LineChart data={lineChartData} height={400} />
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <BarChart data={barChartData} height={400} />
          </TabPanel>
          <TabPanel value={tabIndex} index={2}>
            <PositionChart data={positionChartData} height={400} />
          </TabPanel>
        </Box>

        {/* Runner selection table with fixed height and vertical scroll */}
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
}
