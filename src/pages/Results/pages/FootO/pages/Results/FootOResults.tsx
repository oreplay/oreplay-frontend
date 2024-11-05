import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {parseDateOnlyTime} from "../../../../../../shared/Functions.tsx";
import {RunnersContext} from "../../../../shared/context.ts";
import {parseResultStatus} from "../../../../shared/functions.ts";

export default function FootOResults() {
  const [widthWindow, setWidthWindow] = useState<number>(0);
  const {t} = useTranslation();

  const handleWindowSizeChange = () => {
    setWidthWindow(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, [])

  const [runnersList,isLoading] = useContext(RunnersContext)


  if (isLoading) {
    return (<p>{t('Loading')}</p>)
  } else {
    return (
      <TableContainer sx={{height: '100%', flex: 1, position: 'absolute'}}>
        <Table stickyHeader>
          <TableHead>
            <TableRow key={"table Head"}>
              <TableCell></TableCell>
              <TableCell sx={{fontWeight: "bold"}}>{t('ResultsStage.Name')}</TableCell>
              {widthWindow > 768 ? (
                <TableCell sx={{fontWeight: "bold"}}>{t('ResultsStage.Club')}</TableCell>
              ) : null}
              {widthWindow > 768 ? (
                <TableCell sx={{fontWeight: "bold"}}>{t('ResultsStage.StartTime')}</TableCell>
              ) : <TableCell sx={{fontWeight: "bold"}}>{t('ResultsStage.Times')}</TableCell>}
              {widthWindow > 768 ? (
                <TableCell sx={{fontWeight: "bold"}}>{t('ResultsStage.FinishTime')}</TableCell>
              ) : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {runnersList?.map((runner) => {

              const status = parseResultStatus(runner.runner_results[0].status_code as string)

              return (
                <TableRow sx={{width: {md: "100%", sx: "200px"}}} key={runner.id}>
                  <TableCell key={`${runner.id}`}>{(status==="ok")? runner.runner_results[0].position.toString() : ""}</TableCell>
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
                    <TableCell><Typography>{runner.club.short_name}</Typography></TableCell>
                  ) : null}
                  {widthWindow > 768 ? (
                    <TableCell>{parseDateOnlyTime(runner.runner_results[0].start_time)}</TableCell>
                  ) :
                    <TableCell>
                      <Typography>{parseDateOnlyTime(runner.runner_results[0].start_time)}</Typography>
                      <br></br>
                      <Typography>{(status==="ok")? (runner.runner_results[0].finish_time != null ? parseDateOnlyTime(runner.runner_results[0].finish_time) : "") : t(`ResultsStage.statusCodes.${status}`) }</Typography>
                    </TableCell>}
                  {widthWindow > 768 ? (
                    <TableCell>{(status==="ok")? (runner.runner_results[0].finish_time != null ? parseDateOnlyTime(runner.runner_results[0].finish_time) : "") : t(`ResultsStage.statusCodes.${status}`)}</TableCell>
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