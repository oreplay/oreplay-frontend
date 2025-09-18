import {
  ProcessedRunnerModel,
  RadioSplitModel,
} from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { TableCell, TableRow, Box } from "@mui/material"
import { parseResultStatus } from "../../../../../../../../../shared/sortingFunctions/sortRunners.ts"
import { useTranslation } from "react-i18next"
import { runnerService } from "../../../../../../../../../../../domain/services/RunnerService.ts"
import ParticipantName from "../../../../../../../../../components/ParticipantName.tsx"
import RaceTime from "../../../../../../../../../components/RaceTime.tsx"
import { RESULT_STATUS_TEXT } from "../../../../../../../../../shared/constants.ts"
import RunnerSplit from "./RunnerSplit.tsx"
import RunnerOnlineSplit from "./RunnerOnlineSplit.tsx"
import { getOnlineSplits } from "../shared/footOSplitsTablefunctions.ts"
import { OnlineControlModel } from "../../../../../../../../../../../shared/EntityTypes.ts"
import RaceTimeBehind from "../../../../../../../../../components/RaceTimeBehind.tsx"
import { hasChipDownload as hasChipDownloadFunction } from "../../../../../../../shared/functions.ts"
import RacePosition from "../../../../../../../../../components/RacePosition..tsx"
import { TimeLossResults, getRunnerTimeLossInfo } from "../../utils/timeLossAnalysis.ts"
import { parseSecondsToMMSS } from "../../../../../../../../../../../shared/Functions.tsx"
import React from "react"

type RunnerRowProps = {
  runner: ProcessedRunnerModel
  showCumulative?: boolean
  onlyRadios?: boolean
  radiosList: OnlineControlModel[]
  timeLossResults?: TimeLossResults | null
  timeLossEnabled?: boolean
  colsWidth: number[]
}

const extractRunnerResult = (runner: ProcessedRunnerModel) => runner.stage

const calculateTotalLossTime = (
  runner: ProcessedRunnerModel,
  timeLossResults: TimeLossResults | null,
): number => {
  if (!timeLossResults) {
    return 0
  }

  let totalLoss = 0

  // Calculate loss time for each split
  runner.stage.splits.forEach((split) => {
    if (split.control?.id && split.time !== null) {
      const timeLossInfo = getRunnerTimeLossInfo(timeLossResults, runner.id, split.control.id)
      if (timeLossInfo && timeLossInfo.hasTimeLoss) {
        const controlAnalysis = timeLossResults.analysisPerControl.get(split.control.id)
        if (controlAnalysis) {
          // The timeLossInfo.splitTime should match the split.time for individual splits
          // Calculate the loss as: actual time - estimated good time
          const lossTime = split.time - controlAnalysis.estimatedTimeWithoutError
          if (lossTime > 0) {
            totalLoss += lossTime
          }
        }
      }
    }
  })

  // For finish control, only add if it represents additional loss beyond the splits
  // But typically we don't want to double-count, so commenting this out
  /*
  if (runner.stage.time_seconds > 0) {
    const finishTimeLossInfo = getRunnerTimeLossInfo(timeLossResults, runner.id, "FINISH")
    if (finishTimeLossInfo && finishTimeLossInfo.hasTimeLoss) {
      const finishControlAnalysis = timeLossResults.analysisPerControl.get("FINISH")
      if (finishControlAnalysis) {
        const finishLossTime = runner.stage.time_seconds - finishControlAnalysis.estimatedTimeWithoutError
        if (finishLossTime > 0) {
          totalLoss += finishLossTime
        }
      }
    }
  }
  */

  return Math.max(0, totalLoss)
}

export default function RunnerRow(props: RunnerRowProps) {
  const { t } = useTranslation()
  const result = extractRunnerResult(props.runner)

  const status = parseResultStatus(result.status_code as string)
  const statusOkOrNc = status === RESULT_STATUS_TEXT.ok || status === RESULT_STATUS_TEXT.nc
  const hasChipDownload = hasChipDownloadFunction(props.runner)

  const splits = props.onlyRadios
    ? getOnlineSplits(result.splits, props.radiosList, result.start_time)
    : result.splits

  const excludedStatuses = [
    RESULT_STATUS_TEXT.mp,
    RESULT_STATUS_TEXT.dnf,
    RESULT_STATUS_TEXT.dsq,
    RESULT_STATUS_TEXT.dns,
    RESULT_STATUS_TEXT.ot,
  ]

  const showTimeBehind = statusOkOrNc && result.finish_time != null && hasChipDownload

  const shouldCalculateCleanTime = !excludedStatuses.includes(status) && !props.showCumulative

  const totalLossTime =
    shouldCalculateCleanTime && props.timeLossEnabled
      ? calculateTotalLossTime(props.runner, props.timeLossResults || null)
      : 0

  // Calculate clean time: Total race time - Total loss time
  // Clean time should never be negative
  const cleanTime =
    result.time_seconds > 0 && totalLossTime >= 0
      ? Math.max(0, result.time_seconds - totalLossTime)
      : 0

  return (
    <React.Fragment>
      <TableRow key={`runnerNameRow-${props.runner.id}`}>
        <TableCell
          key={`name${props.runner.id}`}
          colSpan={splits.length + 1 + (props.timeLossEnabled && !props.showCumulative ? 1 : 0)}
          sx={{
            border: "none",
            backgroundColor: "white",
            fontWeight: "bold",
            padding: `16px 16px calc(16px + 2rem) 16px`,
          }}
        >
          <Box
            className="wrapper"
            sx={{ display: "inline-flex", position: "absolute", pointerEvents: "none" }}
          >
            <RacePosition
              position={props.runner.stage.position}
              isNC={props.runner.is_nc || status === RESULT_STATUS_TEXT.nc}
              hasDownload={hasChipDownload}
              slotProps={{ text: { marginRight: 1 } }}
            />
            <ParticipantName
              name={props.runner.full_name}
              subtitle={runnerService.getClubName(props.runner, t)}
            />
          </Box>
        </TableCell>
      </TableRow>
      <TableRow
        key={`runnerTimesRow-${props.runner.id}`}
        sx={{
          "&:before": {
            content: '""',
            display: "block",
            width: "16px",
          },
          "&:after": {
            content: '""',
            display: "block",
            width: "16px",
          },
        }}
      >
        <TableCell
          key={`time${props.runner.id}`}
          sx={{
            border: "none",
            py: "12px",
            px: "16px",
            background:
              "linear-gradient(180deg, #00000008 0%, #F6F6F6FF 10%), linear-gradient(90deg, #00000008 0%, #F6F6F6FF 10%)",
            backgroundBlendMode: "darken",
            backgroundColor: "#F6F6F6",
            borderRadius: "6px 0 0 6px",
            minWidth: props.colsWidth[0],
          }}
        >
          <RaceTime
            key={`raceTime${props.runner.id}`}
            displayStatus
            isFinalTime={hasChipDownload}
            status={status}
            finish_time={result.finish_time}
            time_seconds={result.time_seconds}
            start_time={result.start_time}
          />
          {showTimeBehind && <RaceTimeBehind time_behind={result.time_behind} display={true} />}
        </TableCell>
        {props.timeLossEnabled && !props.showCumulative && (
          <TableCell
            key={`cleanTime${props.runner.id}`}
            sx={{
              py: "12px",
              px: "8px",
              background: "linear-gradient(180deg, #00000008 0%, #F6F6F6FF 10%)",
              backgroundColor: "#F6F6F6",
              border: "none",
              minWidth: props.colsWidth[1],
            }}
          >
            {result.time_seconds > 0 && cleanTime > 0 && shouldCalculateCleanTime
              ? parseSecondsToMMSS(cleanTime)
              : result.time_seconds > 0
                ? "--"
                : ""}
          </TableCell>
        )}
        {splits.map((split, index) => {
          const timeLossInfo =
            props.timeLossEnabled &&
            !props.showCumulative &&
            props.timeLossResults &&
            split.control?.id
              ? getRunnerTimeLossInfo(props.timeLossResults, props.runner.id, split.control.id)
              : null

          return (
            <TableCell
              key={`split${props.runner.id}${split.id}`}
              sx={{
                py: "12px",
                px: "8px",
                background: "linear-gradient(180deg, #00000008 0%, #F6F6F6FF 10%)",
                backgroundColor: "#F6F6F6",
                border: "none",
                minWidth:
                  props.colsWidth[
                    1 + (props.timeLossEnabled && !props.showCumulative ? 1 : 0) + index
                  ],
                "&:last-of-type": {
                  borderRadius: "0 6px 6px 0",
                },
              }}
            >
              {props.onlyRadios ? (
                <RunnerOnlineSplit
                  split={split as RadioSplitModel}
                  startTimeTimestamp={props.runner.stage.start_time}
                />
              ) : (
                <RunnerSplit
                  showCumulative={props.showCumulative}
                  key={`runnerSplit${props.runner.id}${split.id}}`}
                  split={split}
                  timeLossInfo={timeLossInfo}
                  timeLossEnabled={props.timeLossEnabled && !props.showCumulative}
                  timeLossResults={props.timeLossResults}
                />
              )}
            </TableCell>
          )
        })}
      </TableRow>
    </React.Fragment>
  )
}
