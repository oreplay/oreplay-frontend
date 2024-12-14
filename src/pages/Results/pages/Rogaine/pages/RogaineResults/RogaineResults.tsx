import {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {RunnersContext} from "../../../../shared/context.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import {parseSecondsToMMSS} from "../../../../../../shared/Functions.tsx";
import { getPositionOrNc, parseResultStatus } from "../../../../shared/functions.ts";
import { RESULT_STATUS_TEXT } from '../../../../shared/constants.ts'

export default function RogainePoints () {
  const {t} = useTranslation();

  // Manage window resizing
  const [widthWindow, setWidthWindow] = useState<number>(0);

  const handleWindowSizeChange = () => {
    setWidthWindow(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, [])

  // Gather runners data
  const [runnersList,isLoading] = useContext(RunnersContext)

  // Render component
  if (isLoading) {
    return (<p>{t('Loading')}</p>)
  } else {
    return (
      <TableContainer sx={{height: '100%', flex: 1}}>
        <Table stickyHeader>
          <TableHead>
            <TableRow key={"table Head"}>
              <TableCell></TableCell>
              <TableCell sx={{fontWeight: "bold"}}>{t('ResultsStage.Name')}</TableCell>
              {widthWindow > 768 ? (
                <TableCell sx={{fontWeight: "bold"}}>{t('ResultsStage.Club')}</TableCell>
              ) : null}
              {widthWindow > 768 ? (
                <TableCell sx={{fontWeight: "bold"}}>{t('ResultsStage.Points')}</TableCell>
              ) : <TableCell sx={{fontWeight: "bold"}}>{t('ResultsStage.Times')}</TableCell>}
              {widthWindow > 768 ? (
                <TableCell sx={{fontWeight: "bold"}}>{t('ResultsStage.RaceTime')}</TableCell>
              ) : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {runnersList?.map((runner) => {

              const status = parseResultStatus(runner.runner_results[0].status_code as string)
              const statusOkOrNc = status === RESULT_STATUS_TEXT.ok || status === RESULT_STATUS_TEXT.nc

              return (
                <TableRow sx={{width: {md: "100%", sx: "200px"}}} key={runner.id}>
                  <TableCell key={`${runner.id}`}>{getPositionOrNc(runner, t)}</TableCell>
                  {widthWindow > 768 ? (
                    <TableCell>{runner.first_name} {runner.last_name}</TableCell>
                  ) :
                    <TableCell sx={{maxWidth: "180px"}}>
                      <Typography>{runner.first_name}</Typography>
                      <Typography>{runner.last_name}</Typography>
                      <br></br>
                      <Typography sx={{color:'text.secondary'}}>{runner.club.short_name}</Typography>
                    </TableCell>}

                  {widthWindow > 768 ? (
                    <TableCell>{runner.club.short_name}</TableCell>
                  ) : null}
                  {widthWindow > 768 ? (
                    <TableCell>{runner.runner_results[0].position ? `${runner.runner_results[0].points_final}` : ""}</TableCell>
                  ) :
                    <TableCell>
                      <Typography>{(statusOkOrNc)? ( (runner.runner_results[0].points_final || runner.runner_results[0].finish_time)? `${runner.runner_results[0].points_final}` : "")  : ""}</Typography>
                      <br></br>
                      <Typography>{(statusOkOrNc)? (runner.runner_results[0].finish_time != null ? parseSecondsToMMSS(runner.runner_results[0].time_seconds) : "-") : t(`ResultsStage.statusCodes.${status}`) }</Typography>
                    </TableCell>}
                  {widthWindow > 768 ? (
                    <TableCell>{(statusOkOrNc)? (runner.runner_results[0].finish_time != null ? parseSecondsToMMSS(runner.runner_results[0].time_seconds) : "-") : t(`ResultsStage.statusCodes.${status}`) }</TableCell>
                  ) : null}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }
}
