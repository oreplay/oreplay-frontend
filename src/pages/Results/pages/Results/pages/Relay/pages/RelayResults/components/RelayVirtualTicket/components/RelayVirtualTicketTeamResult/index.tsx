import { ProcessedRunnerResultModel } from "../../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { Grid, Typography } from "@mui/material"
import RaceTime from "../../../../../../../../../../components/RaceTime.tsx"
import { hasChipDownload } from "../../../../../../../../shared/functions.ts"
import { CSSProperties } from "react"
import { useTranslation } from "react-i18next"
import { parseResultStatus } from "../../../../../../../../../../shared/sortingFunctions/sortRunners.ts"

interface RelayVirtualTicketTeamResultProps {
  result: ProcessedRunnerResultModel
}

const timesStyles: CSSProperties = {
  fontSize: "small",
}

const titleStyles: CSSProperties = {
  fontWeight: "bold",
  fontSize: "small",
}

export default function RelayVirtualTicketTeamResult({
  result,
}: RelayVirtualTicketTeamResultProps) {
  const { t } = useTranslation()

  return (
    <Grid item xs={12}>
      <Typography style={titleStyles}>{t("ResultsStage.VirtualTicket.RaceTime")}</Typography>
      <RaceTime
        style={timesStyles}
        isFinalTime={hasChipDownload(result)}
        displayStatus
        status={parseResultStatus(result.status_code as string)}
        start_time={result.start_time}
        finish_time={result.finish_time}
        time_seconds={result.time_seconds}
      />
    </Grid>
  )
}
