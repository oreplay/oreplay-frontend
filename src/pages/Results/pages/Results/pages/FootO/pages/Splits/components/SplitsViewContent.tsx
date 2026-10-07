import { useState } from "react"
import { Box } from "@mui/material"
import ExperimentalFeatureAlert from "../../../../../../../../../components/ExperimentalFeatureAlert.tsx"
import { OnlineControlModel } from "../../../../../../../../../shared/EntityTypes.ts"
import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { hasChipDownload } from "../../../../../shared/functions.ts"
import NoRunnerWithSplitsMsg from "../../../components/NoRunnerWithSplitsMsg.tsx"
import TimeLossThresholdSlider from "../../../components/TimeLossThresholdSlider.tsx"
import { DEFAULT_TIME_LOSS_THRESHOLD } from "../../../shared/timeLossThreshold.ts"
import { showsTimeLoss, SPLITS_VIEW_CONFIG, SplitsView } from "../shared/splitsViews.ts"
import FootOSplitsTable from "./FootOSplitsTable/FootOSplitsTable.tsx"

interface SplitsViewContentProps {
  hasRadios: boolean
  isTimeLossOn: boolean
  radiosList: OnlineControlModel[]
  runners: ProcessedRunnerModel[]
  view: SplitsView
}

export default function SplitsViewContent({
  hasRadios,
  isTimeLossOn,
  radiosList,
  runners,
  view,
}: SplitsViewContentProps) {
  const [timeLossThreshold, setTimeLossThreshold] = useState<number>(DEFAULT_TIME_LOSS_THRESHOLD)

  const viewConfig = SPLITS_VIEW_CONFIG[view]
  const hasRunnersWithSplits = runners.some((runner) => hasChipDownload(runner))
  const isMissingSplits = viewConfig.requiresChipDownload && !hasRunnersWithSplits
  const timeLossEnabled = showsTimeLoss(view, isTimeLossOn)
  const showExperimentalAlert = timeLossEnabled && !hasRadios

  if (isMissingSplits) return <NoRunnerWithSplitsMsg />

  return (
    <Box>
      {showExperimentalAlert && (
        <Box sx={{ padding: "16px 16px 0 16px" }}>
          <ExperimentalFeatureAlert />
        </Box>
      )}
      {timeLossEnabled && (
        <TimeLossThresholdSlider threshold={timeLossThreshold} onChange={setTimeLossThreshold} />
      )}
      <FootOSplitsTable
        onlyRadios={viewConfig.onlyRadios}
        radiosList={radiosList}
        runners={runners}
        showCumulative={viewConfig.showCumulative}
        timeLossEnabled={timeLossEnabled}
        timeLossThreshold={timeLossThreshold}
      />
    </Box>
  )
}
