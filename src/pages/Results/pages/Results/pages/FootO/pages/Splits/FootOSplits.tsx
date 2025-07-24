import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import FootOSplitsTable from "./components/FootOSplitsTable/FootOSplitsTable.tsx"
import ChooseClassMsg from "../../../../components/ChooseClassMsg.tsx"
import GeneralErrorFallback from "../../../../../../../../components/GeneralErrorFallback.tsx"
import GeneralSuspenseFallback from "../../../../../../../../components/GeneralSuspenseFallback.tsx"
import { useState, useMemo } from "react"
import { FormControlLabel, Switch, Box, Typography, Slider } from "@mui/material"
import ExperimentalFeatureAlert from "../../../../../../../../components/ExperimentalFeatureAlert.tsx"
import PartialCumulativeSwitch from "./components/PartialCumulativeSwitch.tsx"
import OnlyForClassesMsg from "./components/OnlyForClassesMsg.tsx"
import { analyzeTimeLoss, TimeLossResults } from "./components/utils/timeLossAnalysis.ts"

export default function FootOSplits(
  props: ResultsPageProps<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>,
) {
  const [onlyRadios, setOnlyRadios] = useState<boolean>(false)
  const [showCumulative, setShowCumulative] = useState<boolean>(false)
  const [showCumulativeDisplayed, setShowCumulativeDisplayed] = useState<boolean>(false)
  const [timeLossEnabled, setTimeLossEnabled] = useState<boolean>(false)
  const [timeLossThreshold, setTimeLossThreshold] = useState<number>(15)

  const activeItem = props.activeItem
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const runners = props.runnersQuery.data || []

  const timeLossResults: TimeLossResults | undefined = useMemo(() => {
    if (!timeLossThreshold) return undefined
    return analyzeTimeLoss(runners, timeLossThreshold, showCumulative)
  }, [runners, timeLossThreshold, showCumulative])

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

  return (
    <>
      <ExperimentalFeatureAlert />

      {/* Switch: parciales vs acumulado */}
      <PartialCumulativeSwitch
        active={showCumulativeDisplayed}
        setActive={(newValue) => {
          setShowCumulative(newValue)
          setShowCumulativeDisplayed(newValue)
        }}
        disabled={onlyRadios}
      />

      {/* Radios toggle */}
      {"splits" in activeItem && activeItem.splits.length > 0 ? (
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
      ) : null}

      {/* Análisis de pérdida de tiempo */}
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

      {/* Tabla principal de splits */}
      <FootOSplitsTable
        onlyRadios={onlyRadios}
        radiosList={"splits" in activeItem ? activeItem.splits : []}
        showCumulative={showCumulative}
        key={"FootOSplitsTable"}
        runners={runners}
        timeLossEnabled={timeLossEnabled}
        timeLossThreshold={timeLossThreshold}
        timeLossResults={timeLossResults}
      />
    </>
  )
}
