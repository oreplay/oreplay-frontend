import { useState } from "react"
import { Box, useMediaQuery, useTheme } from "@mui/material"
import ExperimentalFeatureAlert from "../../../../../../../../../components/ExperimentalFeatureAlert.tsx"
import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import TimeLossThresholdSlider from "../../../components/TimeLossThresholdSlider.tsx"
import { DEFAULT_TIME_LOSS_THRESHOLD } from "../../../shared/timeLossThreshold.ts"
import { GRAPH_VIEW, GraphView } from "../shared/graphViews.ts"
import { useSelectedRunners } from "../shared/useSelectedRunners.ts"
import CompactRunnerTable from "./CompactRunnerTable.tsx"
import SelectedGraph from "./SelectedGraph.tsx"

const GRAPH_AREA_HEIGHT = 400

interface GraphsViewContentProps {
  runners: ProcessedRunnerModel[]
  view: GraphView
}

export default function GraphsViewContent({ runners, view }: GraphsViewContentProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [timeLossThreshold, setTimeLossThreshold] = useState<number>(DEFAULT_TIME_LOSS_THRESHOLD)
  const [selectedRunnerIds, setSelectedRunnerIds] = useSelectedRunners(runners)

  const hasTimeLossThreshold = view === GRAPH_VIEW.BarChart

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ padding: "16px 16px 0 16px" }}>
        <ExperimentalFeatureAlert />
      </Box>
      {hasTimeLossThreshold && (
        <TimeLossThresholdSlider threshold={timeLossThreshold} onChange={setTimeLossThreshold} />
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
        <Box sx={{ flex: 1, minHeight: GRAPH_AREA_HEIGHT, order: isMobile ? 2 : 1, px: 2 }}>
          <SelectedGraph
            runners={runners}
            selectedRunnerIds={selectedRunnerIds}
            timeLossThreshold={timeLossThreshold}
            view={view}
          />
        </Box>
        <Box
          sx={{
            width: isMobile ? "100%" : "auto",
            height: GRAPH_AREA_HEIGHT,
            overflowY: "auto",
            overflowX: "hidden",
            order: 2,
          }}
        >
          <CompactRunnerTable
            runners={runners}
            selectedRunners={selectedRunnerIds}
            onSelectionChange={setSelectedRunnerIds}
          />
        </Box>
      </Box>
    </Box>
  )
}
