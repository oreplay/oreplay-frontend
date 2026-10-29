import { useContext } from "react"
import { DateTime } from "luxon"
import Tooltip from "@mui/material/Tooltip"
import { useTranslation } from "react-i18next"
import { NowContext } from "../../../../../../../shared/context.ts"
import { isStageLive } from "../../../../../shared/stageLastUpdate.ts"
import LiveStatusOfflineIcon from "./LiveStatusOfflineIcon.tsx"
import LiveStatusOnlineIcon from "./LiveStatusOnlineIcon.tsx"

interface LiveStatusIconProps {
  lastUpdate: DateTime
}

/**
 * Icon telling whether the stage is still receiving results, with how long ago the latest upload
 * was as its tooltip and accessible name. Reads the current time from the surrounding
 * `NowProvider`.
 * @param props.lastUpdate Moment of the stage's latest upload.
 */
export default function LiveStatusIcon({ lastUpdate }: LiveStatusIconProps) {
  const { t } = useTranslation()
  const now = useContext(NowContext)
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
