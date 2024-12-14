import React from 'react'
import Grid from '@mui/material/Grid';
import {Typography} from "@mui/material";
import {
  ProcessedRunnerResultModel
} from "../../../../../components/VirtualTicket/shared/EntityTypes.ts";
import {parseResultStatus} from "../../../../../shared/functions.ts";
import FinishTime from "../../../../../components/FinishTime.tsx";
import StartTime from "../../../../../components/StartTime.tsx";

type FootOVirtualTicketTimesBannerProps = {
  runnerResult: ProcessedRunnerResultModel
}

/**
 * Displays a runner start and finish times and race time within a virtual ticket for FootO.
 * @param runner Runner to be displayed
 */
const FootOVirtualTicketTimesBanner: React.FC<FootOVirtualTicketTimesBannerProps> = ({runnerResult}) => {
  const status = parseResultStatus(runnerResult.status_code as string)

  return (
    <>
      <Grid item xs={6}>
        <Typography>Start Time: </Typography>
        <StartTime time={runnerResult.start_time} />
      </Grid>
      <Grid item xs={6}>
        <Typography>Finish Time: </Typography>
        <FinishTime status={status} finish_time={runnerResult.finish_time} time_seconds={runnerResult.time_seconds} />
      </Grid>
    </>
  )
}

export default FootOVirtualTicketTimesBanner;
