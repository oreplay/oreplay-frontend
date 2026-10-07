import { useEffect, useMemo, useState } from "react"
import { AxiosError } from "axios"
import { Box } from "@mui/material"
import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { OnlineControlModel, RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import ChooseClassMsg from "../../../../components/ChooseClassMsg.tsx"
import GeneralErrorFallback from "../../../../../../../../components/GeneralErrorFallback.tsx"
import GeneralSuspenseFallback from "../../../../../../../../components/GeneralSuspenseFallback.tsx"
import OnlyForClassesMsg from "../../components/OnlyForClassesMsg.tsx"
import RadiosExperimentalAlert from "../../components/RadiosExperimentalAlert.tsx"
import { sortFootORunners } from "../../shared/functions.ts"
import SplitsToolbar from "./components/SplitsToolbar/SplitsToolbar.tsx"
import SplitsViewContent from "./components/SplitsViewContent.tsx"
import {
  availableSplitsViews,
  defaultSplitsView,
  SPLITS_VIEW_CONFIG,
  SplitsView,
} from "./shared/splitsViews.ts"

const NO_RADIOS: OnlineControlModel[] = []

export default function FootOSplits(
  props: ResultsPageProps<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>,
) {
  const activeItem = props.activeItem
  const runners = useMemo(
    () => sortFootORunners([...(props.runnersQuery.data ?? [])]),
    [props.runnersQuery.data],
  )
  const radiosList = activeItem && "splits" in activeItem ? activeItem.splits : NO_RADIOS
  const hasRadios = radiosList.length > 0

  const [selectedView, setSelectedView] = useState<SplitsView>(defaultSplitsView(hasRadios))
  const [isTimeLossOn, setIsTimeLossOn] = useState(false)

  useEffect(() => {
    setSelectedView(defaultSplitsView(hasRadios))
  }, [hasRadios])

  if (!activeItem) return <ChooseClassMsg />
  if (!props.isClass)
    return (
      <Box sx={{ px: 2 }}>
        <OnlyForClassesMsg />
      </Box>
    )
  if (props.runnersQuery.isFetching) return <GeneralSuspenseFallback />
  if (props.runnersQuery.isError) return <GeneralErrorFallback />

  const toggleTimeLoss = () => setIsTimeLossOn((isOn) => !isOn)

  return (
    <Box>
      {hasRadios && (
        <Box sx={{ px: "16px" }}>
          <RadiosExperimentalAlert />
        </Box>
      )}

      <SplitsToolbar
        isTimeLossAvailable={SPLITS_VIEW_CONFIG[selectedView].supportsTimeLoss}
        isTimeLossOn={isTimeLossOn}
        onTimeLossToggle={toggleTimeLoss}
        onViewChange={setSelectedView}
        selectedView={selectedView}
        views={availableSplitsViews(hasRadios)}
      />

      <SplitsViewContent
        hasRadios={hasRadios}
        isTimeLossOn={isTimeLossOn}
        radiosList={radiosList}
        runners={runners}
        view={selectedView}
      />
    </Box>
  )
}
