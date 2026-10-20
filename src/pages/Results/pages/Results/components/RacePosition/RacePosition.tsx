import { SxProps, Theme, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import {
  getRacePositionColor,
  getRacePositionDisplay,
  RACE_POSITION_PENDING_LABEL,
  toResultStatusText,
} from "../../shared/racePosition.ts"
import NotOkCross from "./components/NotOkCross.tsx"

const POSITION_SLOT_MIN_WIDTH = "4ch"

interface RacePositionSlotProps {
  text: SxProps<Theme>
}

type RacePositionProps = {
  position: number | bigint | null
  statusCode?: string | null
  isNC?: boolean
  hasDownload?: boolean
  slotProps?: RacePositionSlotProps
}

/**
 * Position slot of a result row. It always takes the same width and right-aligns its content so
 * names line up across rows: "NC" for not-competitive runners, a cross when the status is known to
 * be not ok, the position when there is one, and a dash while it is not available yet.
 * @param props.position Position in the classification; `null` or `0` when not available yet.
 * @param props.statusCode Result status code (numeric or text); omitted when unknown.
 * @param props.isNC Whether the runner takes part out of competition.
 * @param props.hasDownload Whether the result is final (chip downloaded), which highlights it.
 * @param props.slotProps Extra styles for the text element.
 */
export default function RacePosition({
  position,
  statusCode,
  isNC,
  hasDownload,
  slotProps,
}: RacePositionProps) {
  const { t } = useTranslation()
  const display = getRacePositionDisplay(position, statusCode, isNC)
  const color = getRacePositionColor(display, hasDownload)
  const statusLabel = t(`ResultsStage.statusCodes.${toResultStatusText(statusCode)}`)

  return (
    <Typography
      sx={{
        color,
        flexShrink: 0,
        textAlign: "end",
        minWidth: POSITION_SLOT_MIN_WIDTH,
        fontVariantNumeric: "tabular-nums",
        ...slotProps?.text,
      }}
    >
      {display === "nc" && t("ResultsStage.statusCodes.nc")}
      {display === "notOk" && <NotOkCross label={statusLabel} />}
      {display === "position" && `${position}.`}
      {display === "pending" && RACE_POSITION_PENDING_LABEL}
    </Typography>
  )
}
