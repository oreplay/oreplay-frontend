import { useContext } from "react"
import { DateTime } from "luxon"
import Tooltip from "@mui/material/Tooltip"
import { useTranslation } from "react-i18next"
import { NowContext } from "../../../../../../../shared/context.ts"
import { hasStageStarted, isStageLive } from "../../../../../shared/stageLastUpdate.ts"
import LiveStatusOfflineIcon from "./LiveStatusOfflineIcon.tsx"
import LiveStatusOnlineIcon from "./LiveStatusOnlineIcon.tsx"

interface LiveStatusIconProps {
  lastUpdate: DateTime
  stageStart?: string | null
}

/**
 * Icon telling whether the stage is still receiving results, with how long ago the latest upload
 * was as its tooltip and accessible name. Renders nothing before the stage starts. Reads the current
 * time from the surrounding `NowProvider`.
 * @param props.lastUpdate Moment of the stage's latest upload.
 * @param props.stageStart Stage start as an ISO date-time; null or absent when unknown, which shows
 * the icon.
 */
export default function LiveStatusIcon({ lastUpdate, stageStart }: LiveStatusIconProps) {
  const { t } = useTranslation()
  const now = useContext(NowContext)
  if (!hasStageStarted(stageStart, now)) {
    return null
  }
  const isLive = isStageLive(lastUpdate, now)
  const label = t("ResultsStage.lastUpdated", {
    time: lastUpdate.toRelative({ base: now, style: "narrow" }),
  })

  return (
    <Tooltip title={label} enterTouchDelay={0}>
      <span role="img" tabIndex={0} className="flex">
        {isLive ? <LiveStatusOnlineIcon /> : <LiveStatusOfflineIcon />}
      </span>
    </Tooltip>
  )
}
