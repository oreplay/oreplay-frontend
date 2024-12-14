import React from 'react'
import {ControlModel} from "../../../../shared/EntityTypes.ts";
import Grid from '@mui/material/Grid';
import {Typography} from "@mui/material";
import {useTranslation} from "react-i18next";

type VirtualTicketRunnerInfoProps = {
  order_number: number|bigint|null
  points?: bigint|number|null
  control: ControlModel|null
}

/**
 * Display a control with the order and its code number
 * @param order_number
 * @param points
 * @param control
 */
const VirtualTicketRunnerInfo: React.FC<VirtualTicketRunnerInfoProps> = ({order_number,points,control}) => {
  const {t} = useTranslation()

  // Finish control
  if (order_number === Infinity) {
    return (
      <Grid item xs={2}>
        <Typography>
          {t('ResultsStage.VirtualTicketContainer.FinishControl')}
        </Typography>
      </Grid>
    )
  }
  // Regular control
  else {
    return (
      <Grid item xs={2}>
        <Typography>
          {order_number?.toString()}
          <Typography
            component="span"
            sx={{ ml: '2px', color: 'text.secondary' }}
          >
            ({control?.station.toString()})
          </Typography>
        </Typography>
        { points ? (
          <Typography>
            {`[${points}]`}
          </Typography>
        ) : (<></>)
        }
      </Grid>)
  }
}

export default VirtualTicketRunnerInfo;
