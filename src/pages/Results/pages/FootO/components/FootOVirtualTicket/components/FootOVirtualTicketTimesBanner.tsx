import React from 'react'
import Grid from '@mui/material/Grid';
import {Box, Typography} from "@mui/material";
import {
  ProcessedRunnerResultModel
} from "../../../../../components/VirtualTicket/shared/EntityTypes.ts";
import {parseDateOnlyTime, parseSecondsToMMSS} from "../../../../../../../shared/Functions.tsx";

type FootOVirtualTicketTimesBannerProps = {
  runnerResult: ProcessedRunnerResultModel
}

/**
 * Displays a runner start and finish times and race time within a virtual ticket for FootO.
 * @param runner Runner to be displayed
 */
const FootOVirtualTicketTimesBanner: React.FC<FootOVirtualTicketTimesBannerProps> = ({runnerResult}) => {

  return (
    <>
      <Grid item xs={6}>
        <Typography sx={{ color: 'text.secondary'}}>
          {`Start Time: ${parseDateOnlyTime(runnerResult.start_time)}`}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
          <Typography>Finish Time: </Typography>
          <Typography sx={{color: 'secondary.main'}}>
            {parseSecondsToMMSS(runnerResult.time_seconds)}
          </Typography>
        </Box>
      </Grid>
    </>
  )
}

export default FootOVirtualTicketTimesBanner;
