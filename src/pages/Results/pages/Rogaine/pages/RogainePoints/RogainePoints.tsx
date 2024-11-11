import {useContext, useState} from "react";
import {RunnersContext} from "../../../../shared/context.ts";
import {useTranslation} from "react-i18next";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Dialog, DialogTitle, DialogContent} from "@mui/material";
import {getUniqueStationNumbers} from "../../shared/Functions.ts";
import { getPositionOrNc, parseResultStatus } from "../../../../shared/functions.ts";
import {parseSecondsToMMSS} from "../../../../../../shared/Functions.tsx";
import ControlBadge from "./components/ControlBadge.tsx";
import SplitsTicket from '../../../components/SplitsTicket.tsx'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { RunnerModel } from '../../../../../../shared/EntityTypes.ts'
import { RESULT_STATUS_TEXT } from '../../../../shared/constants.ts'

export default function RogainePoints() {
  const {t} = useTranslation();
  const [runnersList,isLoading] = useContext(RunnersContext)
  const [dialogOpen, setDialogOpen] = useState(false)

  const controlNumbers = getUniqueStationNumbers(runnersList)

  const [selectedRunner, setSelectedRunner] = useState<RunnerModel | null>(null)
  const handleRowClick = (runner: RunnerModel) => {
    setSelectedRunner(runner)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedRunner(null)
  }

  if (isLoading) {
    return (<p>{t('Loading')}</p>)
  } else {
    return(
      <TableContainer sx={{height: '100%', flex: 1}}>
        <Table>
          <TableHead>
            <TableRow key={"table Head"}>
              <TableCell></TableCell>
              <TableCell sx={{fontWeight: "bold"}}>{t('ResultsStage.Name')}</TableCell>
              <TableCell sx={{fontWeight: "bold"}}>{t('ResultsStage.BonusPoints')}</TableCell>
              <TableCell sx={{fontWeight: "bold"}}>{t('ResultsStage.PenaltyPoints')}</TableCell>
              <TableCell sx={{fontWeight: "bold"}}>{t('ResultsStage.Points')}</TableCell>
              <TableCell sx={{fontWeight: "bold"}}>{t('ResultsStage.FinishTime')}</TableCell>
              {
                // add as many columns as controls
                controlNumbers.map((controlNumber) => (
                  <TableCell key={controlNumber}></TableCell>
                ))
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {
              runnersList.map((runner)=>{
                const status = parseResultStatus(runner.runner_results[0].status_code as string)
                const statusOkOrNc = status === RESULT_STATUS_TEXT.ok || status === RESULT_STATUS_TEXT.nc
                const runnerPunchedControls = getUniqueStationNumbers([runner])

                return (
                  <TableRow sx={{width: {md: "100%", sx: "200px"}}} key={`runner${runner.id}`} onClick={() => handleRowClick(runner)}>
                    <TableCell key={`runner${runner.id}pos`}>
                      {getPositionOrNc(runner, t)}
                    </TableCell>
                    <TableCell sx={{minWidth: "200px"}} key={`runner${runner.id}name`}>
                      <Typography>{`${runner.first_name} ${runner.last_name}`}</Typography>
                      <Typography sx={{color:'text.secondary'}}>{runner.club.short_name}</Typography>
                    </TableCell>
                    <TableCell key={`runner${runner.id}bonus`}>
                      {(runner.runner_results[0].points_final || runner.runner_results[0].finish_time)? `+${runner.runner_results[0].points_bonus}` : ""}
                    </TableCell>
                    <TableCell key={`runner${runner.id}penalty`}>
                      {(runner.runner_results[0].points_final || runner.runner_results[0].finish_time)? `${runner.runner_results[0].points_penalty}` : ""}
                    </TableCell>
                    <TableCell key={`runner${runner.id}points`}>
                      {(runner.runner_results[0].points_final || runner.runner_results[0].finish_time)? `${runner.runner_results[0].points_final}` : ""}
                    </TableCell>
                    <TableCell key={`runner${runner.id}time`}>
                      {(statusOkOrNc)? (runner.runner_results[0].finish_time != null ? parseSecondsToMMSS(runner.runner_results[0].time_seconds) : "-") : t(`ResultsStage.statusCodes.${status}`) }
                    </TableCell>
                    {
                      controlNumbers.map((control)=>{
                        return (
                          <TableCell key={`runner${runner.id}control${control}`}>
                            {
                              (runner.runner_results[0].points_final || runner.runner_results[0].finish_time)?
                                <ControlBadge
                                  number={control}
                                  punched={runnerPunchedControls.includes(control)}
                                /> : ""
                            }
                          </TableCell>
                        )
                      })
                    }
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>

        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
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
              onClick={handleCloseDialog}
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
            {selectedRunner ? <SplitsTicket runner={selectedRunner}/> : ""}
          </DialogContent>
        </Dialog>

      </TableContainer>
    )
  }
}