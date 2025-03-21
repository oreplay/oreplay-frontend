import React, { CSSProperties } from "react"
import Grid from "@mui/material/Grid"
import { Typography } from "@mui/material"
import { ProcessedRunnerResultModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { parseResultStatus } from "../../../../../../../shared/functions.ts"
import RaceTime from "../../../../../../../components/RaceTime.tsx"
import StartTime from "../../../../../../../components/StartTime.tsx"
import { useTranslation } from "react-i18next"
import { hasChipDownload } from "../../../../../shared/functions.ts"

type RogaineVirtualTicketPointsBannerProps = {
  runnerResult: ProcessedRunnerResultModel
}

/**
 * Displays a runner start and finish times and race time within a virtual ticket for FootO.
 * @param runner Runner to be displayed
 */
const RogaineVirtualTicketPointsBanner: React.FC<RogaineVirtualTicketPointsBannerProps> = ({
  runnerResult,
}) => {
  const { t } = useTranslation()

  const titleStyles: CSSProperties = {
    fontWeight: "bold",
    fontSize: "small",
  }

  const gridStyles: CSSProperties = {
    display: "flex",
  }

  const textStyles: CSSProperties = {
    fontSize: "small",
    marginLeft: "6px",
  }

  const status = parseResultStatus(runnerResult.status_code as string)
  return (
    <>
      <Grid style={gridStyles} item xs={4}>
        <Typography style={titleStyles}>{t("ResultsStage.BonusPoints")}</Typography>
        <Typography style={textStyles}>
          {runnerResult.points_final || runnerResult.finish_time
            ? `+${runnerResult.points_bonus}`
            : ""}
        </Typography>
      </Grid>
      <Grid style={gridStyles} item xs={4}>
        <Typography style={titleStyles}>{t("ResultsStage.PenaltyPoints")}</Typography>
        <Typography style={textStyles}>
          {runnerResult.points_final || runnerResult.finish_time
            ? `${runnerResult.points_penalty}`
            : ""}
        </Typography>
      </Grid>
      <Grid sx={{ justifyContent: "flex-end" }} style={gridStyles} item xs={4}>
        <Typography style={titleStyles}>{t("ResultsStage.Points")}</Typography>
        <Typography style={textStyles}>
          {runnerResult.points_final || runnerResult.finish_time
            ? `${runnerResult.points_final}`
            : ""}
        </Typography>
      </Grid>
      <Grid style={gridStyles} item xs={6}>
        <Typography style={titleStyles}>{t("ResultsStage.VirtualTicket.StartHour")}</Typography>
        <StartTime style={textStyles} startTime={runnerResult.start_time} />
      </Grid>
      <Grid style={gridStyles} sx={{ justifyContent: "flex-end" }} item xs={6}>
        <Typography style={titleStyles}>{t("ResultsStage.VirtualTicket.RaceTime")}</Typography>
        <RaceTime
          style={textStyles}
          status={status}
          isFinalTime={hasChipDownload(runnerResult)}
          start_time={runnerResult.start_time}
          finish_time={runnerResult.finish_time}
          time_seconds={runnerResult.time_seconds}
        />
      </Grid>
    </>
  )
}

export default RogaineVirtualTicketPointsBanner
