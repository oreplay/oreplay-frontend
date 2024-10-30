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
import {parseDateOnlyTime} from "../../../../../../shared/Functions.tsx";

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
                <TableCell sx={{fontWeight: "bold"}}>{t('ResultsStage.Points')}</TableCell>
              ) : <TableCell sx={{fontWeight: "bold"}}>{t('ResultsStage.Times')}</TableCell>}
              {widthWindow > 768 ? (
                <TableCell sx={{fontWeight: "bold"}}>{t('ResultsStage.FinishTime')}</TableCell>
              ) : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {runnersList?.map((runner) => {
              return (
                <TableRow sx={{width: {md: "100%", sx: "200px"}}} key={runner.id}>
                  <TableCell key={`${runner.id}`}>{runner.runner_results[0].position.toString()}</TableCell>
                  {widthWindow > 768 ? (
                    <TableCell>{runner.first_name} {runner.last_name}</TableCell>
                  ) :
                    <TableCell sx={{maxWidth: "180px"}}>
                      <Typography>{runner.first_name}</Typography>
                      <Typography>{runner.last_name}</Typography>
                      <br></br>
                      <Typography>{runner.club.short_name}</Typography>
                    </TableCell>}

                  {widthWindow > 768 ? (
                    <TableCell>{runner.club.short_name}</TableCell>
                  ) : null}
                  {widthWindow > 768 ? (
                    <TableCell>{`${runner.runner_results[0].points_final}`}</TableCell>
                  ) :
                    <TableCell>
                      <Typography>{`${runner.runner_results[0].points_final}`}</Typography>
                      <br></br>
                      <Typography>{runner.runner_results[0].finish_time != null ? parseDateOnlyTime(runner.runner_results[0].finish_time) : "-"}</Typography>
                    </TableCell>}
                  {widthWindow > 768 ? (
                    <TableCell>{runner.runner_results[0].finish_time != null ? parseDateOnlyTime(runner.runner_results[0].finish_time) : "-"}</TableCell>
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