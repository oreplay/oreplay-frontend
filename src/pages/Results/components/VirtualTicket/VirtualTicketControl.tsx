import React from 'react'
import {ControlModel} from "../../../../shared/EntityTypes.ts";
import Grid from '@mui/material/Grid';
import {Box, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";

type VirtualTicketControlProps = {
  order_number: number|bigint|null
  points?: bigint|number|null
  control: ControlModel|null
  gridWidth: number
}

/**
 * Display a control with the order and its code number
 * @param order_number punched order of the control
 * @param points points given by this control
 * @param control control that represents
 * @param gridWidth xs width of the control element
 */
const VirtualTicketControl: React.FC<VirtualTicketControlProps> = ({
  order_number,
  points,
  control,
  gridWidth
}) => {
  const {t} = useTranslation()

  // Finish control
  if (order_number === Infinity) {
    return (
      <Grid item xs={gridWidth}>
        <Typography>
          {t('ResultsStage.VirtualTicket.FinishControl')}
        </Typography>
      </Grid>
    )
  }
  // Regular control
  else {
    return (
      <Grid item xs={gridWidth}>
        <Box sx={{
          display:'flex',
          flexDirection:'row',
          flexWrap:'wrap',
        }}>
          <Typography>
            {order_number?.toString()}
          </Typography>
          <Typography
            sx={{ ml: '2px', color: 'text.secondary' }}
          >
            ({control?.station.toString()})
          </Typography>
          { points ? (
            <Typography>
              {`[${points}]`}
            </Typography>
          ) : (<></>)
          }

        </Box>
      </Grid>)
  }
}

export default VirtualTicketControl;
