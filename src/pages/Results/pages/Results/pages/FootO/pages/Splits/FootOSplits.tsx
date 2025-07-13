import { ResultsPageProps } from "../../../../shared/commonProps.ts"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { AxiosError } from "axios"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import FootOSplitsTable from "./components/FootOSplitsTable/FootOSplitsTable.tsx"
import ChooseClassMsg from "../../../../components/ChooseClassMsg.tsx"
import GeneralErrorFallback from "../../../../../../../../components/GeneralErrorFallback.tsx"
import GeneralSuspenseFallback from "../../../../../../../../components/GeneralSuspenseFallback.tsx"
import { useState } from "react"
import { FormControlLabel, Switch, Box, Typography, Slider } from "@mui/material"
import ExperimentalFeatureAlert from "../../../../../../../../components/ExperimentalFeatureAlert.tsx"
import PartialCumulativeSwitch from "./components/PartialCumulativeSwitch.tsx"
import OnlyForClassesMsg from "./components/OnlyForClassesMsg.tsx"

export default function FootOSplits(
  props: ResultsPageProps<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>,
) {
  const [onlyRadios, setOnlyRadios] = useState<boolean>(false)
  const [showCumulative, setShowCumulative] = useState<boolean>(false)
  const [showCumulativeDisplayed, setShowCumulativeDisplayed] = useState<boolean>(false)
  const [timeLossEnabled, setTimeLossEnabled] = useState<boolean>(false)
  const [timeLossThreshold, setTimeLossThreshold] = useState<number>(20)

  if (!props.activeItem) {
    return <ChooseClassMsg />
  } else if (!props.isClass) {
    return <OnlyForClassesMsg />
  } else if (props.runnersQuery.isFetching) {
    return <GeneralSuspenseFallback />
  } else if (props.runnersQuery.isError) {
    return <GeneralErrorFallback />
  } else {
    return (
      <>
        <ExperimentalFeatureAlert />
        <PartialCumulativeSwitch
          active={showCumulativeDisplayed}
          setActive={(newValue) => {
            setShowCumulative(newValue)
            setShowCumulativeDisplayed(newValue)
          }}
          disabled={onlyRadios}
        />
        {"splits" in props.activeItem && props.activeItem.splits.length > 0 ? (
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
        ) : (
          <></>
        )}

        {/* Contenedor con switch de análisis y slider de umbral juntos */}
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
              label="Análisis de pérdida de tiempo"
            />

            {timeLossEnabled && (
              <>
                <Typography
                  sx={{
                    minWidth: 80,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    mr: 0.5, // margén derecho pequeño para pegar al slider
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
                    aria-label="Umbral de pérdida de tiempo"
                    size="small"
                    marks
                  />
                </Box>
              </>
            )}
          </Box>
        )}

        <FootOSplitsTable
          onlyRadios={onlyRadios}
          radiosList={"splits" in props.activeItem ? props.activeItem.splits : []}
          showCumulative={showCumulative}
          key={"FootOSplitsTable"}
          runners={props.runnersQuery.data ? props.runnersQuery.data : []}
          timeLossEnabled={timeLossEnabled}
          timeLossThreshold={timeLossThreshold}
        />
      </>
    )
  }
}
