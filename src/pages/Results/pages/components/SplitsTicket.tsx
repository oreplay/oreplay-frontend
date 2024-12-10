import {
  Box,
  Typography,
  Grid,
  Divider,
  DialogTitle,
  IconButton,
  DialogContent, Dialog
} from "@mui/material";
import React from "react";
import { RunnerModel, SplitModel } from '../../../../shared/EntityTypes.ts'
import { parseDateOnlyTime, parseSecondsToMMSS } from '../../../../shared/Functions.tsx'
import CloseIcon from "@mui/icons-material/Close";

interface SplitsTicketProps {
  isTicketOpen: boolean
  runner: RunnerModel|null
  handleCloseTicket: ()=>void
}

const SplitsTicket: React.FC<SplitsTicketProps> = ({ isTicketOpen,runner,handleCloseTicket }) => {

  if (runner) {
    const runnerResults = runner.runner_results[0]

    return (
      <Dialog
        open={isTicketOpen}
        onClose={handleCloseTicket}
        sx={{
          '& .MuiDialog-paper': {
            width: '100%',
            height: 'calc(100% - 5%)',
            maxWidth: '430px',
            maxHeight: 'none',
          },
        }}
      >
        <DialogTitle
          sx={{
            marginBottom: 2,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCloseTicket}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {runner ?
            (
              <Box>
                <Grid container spacing={1}>
                  <Grid item xs={12} sx={{ mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {`${runner.first_name} ${runner.last_name}`}
                    </Typography>

                    <Grid container spacing={1}>
                      <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography>Club: </Typography>
                        <Typography sx={{ color: 'primary.main', fontSize: '1.1rem', fontWeight: 'bold', ml: 1 }}>
                          {runner.club.short_name}
                        </Typography>
                      </Grid>

                      <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ fontWeight: 'bold' }}>{runner.class.short_name}</Typography>
                      </Grid>
                    </Grid>

                    <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                      {`SportIdent: ${runner.sicard}`}
                    </Typography>
                  </Grid>

                  {runnerResults.start_time && (
                    <Grid item xs={6}>
                      <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{`Start Time: ${parseDateOnlyTime(runnerResults.start_time)}`}</Typography>
                    </Grid>
                  )}
                  <Grid item xs={6}>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                      <Typography>Finish Time: </Typography>
                      <Typography sx={{ color: 'secondary.main', fontWeight: 'bold', fontSize: '1.1em', ml: 1 }}>
                        {parseSecondsToMMSS(runnerResults.time_seconds)}
                      </Typography>
                    </Box>
                  </Grid>
                  {
                    runnerResults.points_final ? (
                      <>
                        <Grid item xs={6}>
                          <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{`Points bonus: ${runnerResults.points_bonus}`}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{`Points penalty: ${runnerResults.points_penalty}`}</Typography>
                        </Grid>
                        <Grid item xs={6}>{/* empty */}</Grid>
                        <Grid item xs={6}>
                          <Typography sx={{ color: 'secondary.main', fontWeight: 'bold', fontSize: '1.1em' }}>
                            {runnerResults.points_final.toString()} points
                          </Typography>
                        </Grid>
                      </>
                    ) : null
                  }

                  {/* Headers Row 1 */}
                  <Grid item xs={6} sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Parcial</Typography>
                    <Divider />
                  </Grid>
                  <Grid item xs={6} sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Comparación</Typography>
                    <Divider />
                  </Grid>
                  {/* Headers Row 2 */}
                  <Grid item xs={2}><Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Control</Typography></Grid>
                  <Grid item xs={2}><Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Tiempo</Typography></Grid>
                  <Grid item xs={3}><Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Dif.</Typography></Grid>
                  <Grid item xs={2}><Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Tiempo</Typography></Grid>
                  <Grid item xs={3}><Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Dif.</Typography></Grid>

                  {/* Times Rows */}
                  {runnerResults.splits.map((split: SplitModel) => (
                    <React.Fragment key={split.id}>
                      <Grid item xs={2}>
                        <Typography>
                          <span>{split.order_number?.toString()}</span>
                          <Typography
                            component="span"
                            sx={{ ml: '2px', color: 'text.secondary', fontSize: '0.875rem' }}
                          >
                            ({split.control.station.toString()})
                          </Typography>
                        </Typography>
                        <Typography>
                          {split.points ? `[${split.points}]` : ''}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography>{parseDateOnlyTime(split.reading_time)}</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography>{`+${Math.floor(Math.random() * 60)}:${Math.floor(Math.random() * 60)} (${Math.floor(Math.random() * 10)})`}</Typography>
                        <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{`+${60 + Math.floor(Math.random() * 60)}:${Math.floor(Math.random() * 60)} (${Math.floor(Math.random() * 10)})`}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography>{parseDateOnlyTime(split.reading_time)}</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography>{`+${Math.floor(Math.random() * 60)}`}</Typography>
                      </Grid>
                    </React.Fragment>
                  ))}
                </Grid>
              </Box>
            )
            : ""}
        </DialogContent>
      </Dialog>
    );
  } else {
    return <></>
  }
};

export default SplitsTicket;
