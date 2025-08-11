import { useState, useMemo, useEffect } from "react"
import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import FootOSplitsTable from "./components/FootOSplitsTable/FootOSplitsTable.tsx"
import ChooseClassMsg from "../../../../components/ChooseClassMsg.tsx"
import GeneralErrorFallback from "../../../../../../../../components/GeneralErrorFallback.tsx"
import GeneralSuspenseFallback from "../../../../../../../../components/GeneralSuspenseFallback.tsx"
import { Box, useTheme, useMediaQuery, Slider, Typography } from "@mui/material"
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
import { useTranslation } from "react-i18next"
import RadiosExperimentalAlert from "../../components/RadiosExperimentalAlert.tsx"
import { hasChipDownload } from "../../../../shared/functions.ts"
import NoRunnerWithSplitsMsg from "./components/FootOSplitsTable/components/NoRunnerWithSplitsMsg.tsx"

export default function FootOSplits(
  props: ResultsPageProps<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>,
) {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const activeItem = props.activeItem
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const runners = props.runnersQuery.data || []
  const hasRadios = !!(activeItem && "splits" in activeItem && activeItem.splits.length > 0)

  const runnersWithChipDownload = runners.filter((runner) => hasChipDownload(runner))
  const hasChipDownloadData = runnersWithChipDownload.length > 0

  const displayRadiosAlert =
    props.isClass &&
    props.activeItem &&
    "splits" in props.activeItem &&
    props.activeItem.splits.length > 0

  const [selectedView, setSelectedView] = useState<ViewType>(hasRadios ? "radios" : "splits")

  useEffect(() => {
    setSelectedView(hasRadios ? "radios" : "splits")
  }, [hasRadios])

  const [showCumulative, setShowCumulative] = useState<boolean>(false)
  const [timeLossThreshold, setTimeLossThreshold] = useState<number>(15)
  const [barChartThreshold, setBarChartThreshold] = useState<number>(15)
  const [selectedRunners, setSelectedRunners] = useState<string[]>([])

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
        .filter((runner) => runner.stage.position && hasChipDownload(runner))
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
      case "radios":
        setShowCumulative(false)
        break
      case "accumulated":
        setShowCumulative(true)
        break
      case "timeLoss":
        setShowCumulative(false)
        break
    }
  }

  const timeLossResults: TimeLossResults | undefined = useMemo(() => {
    if (!timeLossThreshold) return undefined
    return analyzeTimeLoss(runners, timeLossThreshold, showCumulative)
  }, [runners, timeLossThreshold, showCumulative])

  const barChartTimeLossResults: TimeLossResults | undefined = useMemo(() => {
    if (!barChartThreshold) return undefined
    return analyzeTimeLoss(runners, barChartThreshold, false)
  }, [runners, barChartThreshold])

  const lineChartData = useMemo(() => {
    if (selectedView !== "lineChart" || selectedRunners.length === 0) return []
    return transformRunnersForLineChart(runners, selectedRunners, t)
  }, [selectedView, runners, selectedRunners, t])

  const barChartData = useMemo(() => {
    if (selectedView !== "barChart" || selectedRunners.length === 0) return []
    return transformRunnersForBarChart(runners, selectedRunners, barChartTimeLossResults)
  }, [selectedView, runners, selectedRunners, barChartTimeLossResults])

  const positionChartData = useMemo(() => {
    if (selectedView !== "positionChart" || selectedRunners.length === 0) return []
    return transformRunnersForPositionChart(runners, selectedRunners, t)
  }, [selectedView, runners, selectedRunners, t])

  const handleRunnerSelectionChange = (runnerIds: string[]) => {
    setSelectedRunners(runnerIds)
  }

  if (!activeItem) return <ChooseClassMsg />
  if (!props.isClass)
    return (
      <Box sx={{ px: 2 }}>
        <OnlyForClassesMsg />
      </Box>
    )
  if (props.runnersQuery.isFetching) return <GeneralSuspenseFallback />
  if (props.runnersQuery.isError) return <GeneralErrorFallback />

  const renderSplitsView = () => {
    if (!hasChipDownloadData) return <NoRunnerWithSplitsMsg />

    return (
      <Box>
        <FootOSplitsTable
          onlyRadios={false}
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
  }

  const renderAccumulatedView = () => {
    if (!hasChipDownloadData) return <NoRunnerWithSplitsMsg />

    return (
      <Box>
        <FootOSplitsTable
          onlyRadios={false}
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
  }

  const renderRadiosView = () => {
    return (
      <Box>
        {!displayRadiosAlert && (
          <Box sx={{ padding: "16px 16px 0 16px" }}>
            <ExperimentalFeatureAlert />
          </Box>
        )}
        <FootOSplitsTable
          onlyRadios={true}
          radiosList={"splits" in activeItem ? activeItem.splits : []}
          showCumulative={showCumulative}
          key={"FootOSplitsTableRadios"}
          runners={runners}
          timeLossEnabled={false}
          timeLossThreshold={timeLossThreshold}
          timeLossResults={undefined}
        />
      </Box>
    )
  }

  const renderTimeLossView = () => {
    if (!hasChipDownloadData) return <NoRunnerWithSplitsMsg />

    return (
      <Box>
        {!displayRadiosAlert && (
          <Box sx={{ padding: "16px 16px 0 16px" }}>
            <ExperimentalFeatureAlert />
          </Box>
        )}
        <Box sx={{ px: "16px", pb: "16px", display: "flex", alignItems: "center", gap: 2 }}>
          <Typography sx={{ whiteSpace: "nowrap" }}>
            {t("Graphs.ThresholdWithPercent", { percent: timeLossThreshold })}
          </Typography>
          <Slider
            size="small"
            value={timeLossThreshold}
            min={5}
            max={100}
            step={5}
            marks
            onChange={(_, newValue) => {
              if (typeof newValue === "number") setTimeLossThreshold(newValue)
            }}
            sx={{ flexGrow: 1, maxWidth: 300 }}
          />
        </Box>

        <FootOSplitsTable
          onlyRadios={false}
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
  }

  const renderChartView = () => {
    if (!hasChipDownloadData) return <NoRunnerWithSplitsMsg />

    return (
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {!displayRadiosAlert && (
          <Box sx={{ padding: "16px 16px 0 16px" }}>
            <ExperimentalFeatureAlert />
          </Box>
        )}
        {selectedView === "barChart" && (
          <Box sx={{ px: "16px", display: "flex", alignItems: "center", gap: 2 }}>
            <Typography>
              {t("Graphs.ThresholdWithPercent", { percent: barChartThreshold })}
            </Typography>
            <Slider
              size="small"
              value={barChartThreshold}
              min={5}
              max={100}
              step={5}
              marks
              onChange={(_, newValue) => {
                if (typeof newValue === "number") {
                  setBarChartThreshold(newValue)
                }
              }}
              sx={{ flexGrow: 1, maxWidth: 300 }}
            />
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
            flex: 1,
            minHeight: 0,
          }}
        >
          <Box sx={{ flex: 1, minHeight: 400, order: isMobile ? 2 : 1, px: 2 }}>
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
              order: 2,
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

  return (
    <Box>
      {displayRadiosAlert && (
        <Box sx={{ px: "16px" }}>
          <RadiosExperimentalAlert />
        </Box>
      )}

      <ViewSelector
        selectedView={selectedView}
        onViewChange={handleViewChange}
        hasRadios={hasRadios}
      />

      {selectedView === "splits" && renderSplitsView()}
      {selectedView === "accumulated" && renderAccumulatedView()}
      {selectedView === "radios" && renderRadiosView()}
      {selectedView === "timeLoss" && renderTimeLossView()}
      {(selectedView === "lineChart" ||
        selectedView === "barChart" ||
        selectedView === "positionChart") &&
        renderChartView()}
    </Box>
  )
}
