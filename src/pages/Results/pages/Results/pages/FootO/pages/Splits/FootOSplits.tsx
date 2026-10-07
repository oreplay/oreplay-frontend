import { useEffect, useMemo, useState } from "react"
import { AxiosError } from "axios"
import { Box } from "@mui/material"
import {
  AccessTime as AccessTimeIcon,
  Analytics as AnalyticsIcon,
  SettingsRemote as SettingsRemoteIcon,
  Timer as TimerIcon,
} from "@mui/icons-material"
import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { OnlineControlModel, RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import ChooseClassMsg from "../../../../components/ChooseClassMsg.tsx"
import GeneralErrorFallback from "../../../../../../../../components/GeneralErrorFallback.tsx"
import GeneralSuspenseFallback from "../../../../../../../../components/GeneralSuspenseFallback.tsx"
import OnlyForClassesMsg from "../../components/OnlyForClassesMsg.tsx"
import RadiosExperimentalAlert from "../../components/RadiosExperimentalAlert.tsx"
import ViewSelector from "../../components/ViewSelector.tsx"
import { sortFootORunners } from "../../shared/functions.ts"
import { ViewOption } from "../../shared/viewOption.ts"
import SplitsViewContent from "./components/SplitsViewContent.tsx"
import {
  availableSplitsViews,
  defaultSplitsView,
  SPLITS_VIEW,
  SplitsView,
} from "./shared/splitsViews.ts"

const NO_RADIOS: OnlineControlModel[] = []

const SPLITS_VIEW_OPTIONS: Record<SplitsView, ViewOption<SplitsView>> = {
  [SPLITS_VIEW.Accumulated]: {
    icon: <AccessTimeIcon />,
    key: SPLITS_VIEW.Accumulated,
    labelKey: "view.accumulated",
  },
  [SPLITS_VIEW.Radios]: {
    icon: <SettingsRemoteIcon />,
    key: SPLITS_VIEW.Radios,
    labelKey: "view.radios",
  },
  [SPLITS_VIEW.Splits]: { icon: <TimerIcon />, key: SPLITS_VIEW.Splits, labelKey: "view.splits" },
  [SPLITS_VIEW.TimeLoss]: {
    icon: <AnalyticsIcon />,
    key: SPLITS_VIEW.TimeLoss,
    labelKey: "view.timeLoss",
  },
}

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

  const viewOptions = availableSplitsViews(hasRadios).map((view) => SPLITS_VIEW_OPTIONS[view])

  return (
    <Box>
      {hasRadios && (
        <Box sx={{ px: "16px" }}>
          <RadiosExperimentalAlert />
        </Box>
      )}

      <ViewSelector
        options={viewOptions}
        selectedView={selectedView}
        onViewChange={setSelectedView}
      />

      <SplitsViewContent
        hasRadios={hasRadios}
        radiosList={radiosList}
        runners={runners}
        view={selectedView}
      />
    </Box>
  )
}
