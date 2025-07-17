import { Typography, SxProps, Theme } from "@mui/material"
import {
  parseSecondsToMMSS,
  parseTimeBehind,
} from "../../../../../../../../../../../shared/Functions.tsx"
import { ProcessedSplitModel } from "../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { RunnerTimeLossInfo, TimeLossResults } from "../../utils/timeLossAnalysis.ts"

type RunnerSplitProps = {
  split: ProcessedSplitModel
  showCumulative?: boolean
  timeLossInfo?: RunnerTimeLossInfo | null
  timeLossEnabled?: boolean
  timeLossResults?: TimeLossResults | null
}

type ColorFontWeightStyle = {
  color?: string
  fontWeight?: string | number
}

const styles: SxProps<Theme> = {
  fontSize: "small",
}

const getTimeLossStyles = (
  timeLossInfo: RunnerTimeLossInfo | null | undefined,
  timeLossEnabled: boolean,
): ColorFontWeightStyle => {
  if (!timeLossEnabled || !timeLossInfo) {
    return {}
  }

  const baseStyles: ColorFontWeightStyle = {}

  switch (timeLossInfo.rank) {
    case 1:
      baseStyles.color = "#006400" // Dark green
      baseStyles.fontWeight = "bold"
      break
    case 2:
      baseStyles.color = "#228B22" // Medium green
      baseStyles.fontWeight = "bold"
      break
    case 3:
      baseStyles.color = "#76D276" // Light green
      baseStyles.fontWeight = "bold"
      break
  }

  if (timeLossInfo.hasTimeLoss) {
    baseStyles.color = "#FF0000"
    baseStyles.fontWeight = "bold"
  }

  return baseStyles
}

const calculateLossTime = (
  timeLossInfo: RunnerTimeLossInfo | null,
  timeLossResults: TimeLossResults | null,
  controlId: string | undefined,
): number => {
  if (!timeLossInfo || !timeLossResults || !controlId || !timeLossInfo.hasTimeLoss) {
    return 0
  }

  const controlAnalysis = timeLossResults.analysisPerControl.get(controlId)
  if (!controlAnalysis) {
    return 0
  }

  const lossTime = timeLossInfo.splitTime - controlAnalysis.estimatedTimeWithoutError
  return lossTime > 0 ? lossTime : 0
}

export default function RunnerSplit({
  split,
  showCumulative,
  timeLossInfo,
  timeLossEnabled = false,
  timeLossResults,
}: RunnerSplitProps) {
  const timeLossStyles = getTimeLossStyles(timeLossInfo, timeLossEnabled)
  const lossTime = calculateLossTime(
    timeLossInfo || null,
    timeLossResults || null,
    split.control?.id,
  )

  const lossTimeElement =
    timeLossEnabled && lossTime > 0 ? (
      <Typography
        sx={{
          ...styles,
          color: "#FF0000",
          fontWeight: "normal",
          marginTop: "2px",
        }}
      >
        ({parseSecondsToMMSS(lossTime)})
      </Typography>
    ) : null

  if (showCumulative) {
    const isScratch = split.cumulative_position === 1

    const timeStyles: SxProps<Theme> = {
      ...styles,
      ...(timeLossEnabled ? timeLossStyles : { fontWeight: isScratch ? "bold" : undefined }),
    }

    const behindStyles: SxProps<Theme> = {
      ...styles,
      ...(timeLossEnabled ? timeLossStyles : { fontWeight: isScratch ? "bold" : undefined }),
    }

    return (
      <>
        <Typography sx={timeStyles}>
          {split.cumulative_time !== null ? parseSecondsToMMSS(split.cumulative_time) : "--"}
        </Typography>
        <Typography sx={behindStyles}>
          {split.cumulative_behind !== null
            ? `${parseTimeBehind(split.cumulative_behind)} (${split.cumulative_position})`
            : "--"}
        </Typography>
        {lossTimeElement}
      </>
    )
  } else {
    const isScratch = split.position === 1

    const timeStyles: SxProps<Theme> = {
      ...styles,
      ...(timeLossEnabled ? timeLossStyles : { fontWeight: isScratch ? "bold" : undefined }),
    }

    const behindStyles: SxProps<Theme> = {
      ...styles,
      ...(timeLossEnabled ? timeLossStyles : { fontWeight: isScratch ? "bold" : undefined }),
    }

    return (
      <>
        <Typography sx={timeStyles}>
          {split.time !== null ? parseSecondsToMMSS(split.time) : "--"}
        </Typography>
        <Typography sx={behindStyles}>
          {split.time_behind !== null
            ? `${parseTimeBehind(split.time_behind)} (${split.position})`
            : "--"}
        </Typography>
        {lossTimeElement}
      </>
    )
  }
}
