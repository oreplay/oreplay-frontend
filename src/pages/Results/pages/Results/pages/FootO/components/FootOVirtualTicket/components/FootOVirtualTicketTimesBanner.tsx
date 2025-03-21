import React, { CSSProperties } from "react"
import Grid from "@mui/material/Grid"
import { Typography } from "@mui/material"
import { ProcessedRunnerResultModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { parseResultStatus } from "../../../../../../../shared/functions.ts"
import RaceTime from "../../../../../../../components/RaceTime.tsx"
import StartTime from "../../../../../../../components/StartTime.tsx"
import { useTranslation } from "react-i18next"
import { hasChipDownload } from "../../../../../shared/functions.ts"

type FootOVirtualTicketTimesBannerProps = {
  runnerResult: ProcessedRunnerResultModel
}

/**
 * Displays a runner start and finish times and race time within a virtual ticket for FootO.
 * @param runner Runner to be displayed
 */
const FootOVirtualTicketTimesBanner: React.FC<FootOVirtualTicketTimesBannerProps> = ({
  runnerResult,
}) => {
  const { t } = useTranslation()
  const status = parseResultStatus(runnerResult.status_code as string)

  const gridStylesStartTime: CSSProperties = {
    display: "flex",
    padding: 8,
  }

  const gridStylesTotalTime: CSSProperties = {
    display: "flex",
    padding: "8px 0px 8px 8px",
    justifyContent: "flex-end",
  }

  const titleStyles: CSSProperties = {
    fontWeight: "bold",
    fontSize: "small",
  }

  const timesStyles: CSSProperties = {
    fontSize: "small",
  }

  return (
    <>
      <Grid style={gridStylesStartTime} item xs={6}>
        <Typography style={titleStyles}>{t("ResultsStage.VirtualTicket.StartHour")}</Typography>
        <StartTime style={timesStyles} startTime={runnerResult.start_time} />
      </Grid>
      <Grid style={gridStylesTotalTime} item xs={6}>
        <Typography style={titleStyles}>{t("ResultsStage.VirtualTicket.RaceTime")}</Typography>
        <RaceTime
          style={timesStyles}
          isFinalTime={hasChipDownload(runnerResult)}
          displayStatus
          status={status}
          start_time={runnerResult.start_time}
          finish_time={runnerResult.finish_time}
          time_seconds={runnerResult.time_seconds}
        />
      </Grid>
    </>
  )
}

export default FootOVirtualTicketTimesBanner
