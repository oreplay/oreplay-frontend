import React from 'react'
import {ProcessedRunnerModel} from "./shared/EntityTypes.ts";
import Grid from '@mui/material/Grid';
import {Box, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";

type VirtualTicketRunnerInfoProps = {
  runner: ProcessedRunnerModel
}

/**
 * Display a runners name, club and class within a virtual ticket.
 * @param runner Runner to be displayed
 */
const VirtualTicketRunnerInfo: React.FC<VirtualTicketRunnerInfoProps> = ({runner}) => {
  const {t} = useTranslation()

  return (
    <Grid item xs={12} sx={{ mb: 1 }}>
      <Typography sx={{ fontWeight: 'bold' }}>
        {`${runner.first_name} ${runner.last_name}`}
      </Typography>
      <Box sx={{
        width:'100%',
        display:'inline-flex',
        justifyContent:'space-between'
      }}>
        <Typography sx={{color:'text.secondary'}}>
          {runner.club ? `${runner.club.short_name}` : t('ResultsStage.NoClubMsg')}
        </Typography>
        <Typography>
          {runner.class.short_name}
        </Typography>
      </Box>
    </Grid>
  )
}

export default VirtualTicketRunnerInfo;
