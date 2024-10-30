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

  const orderedRunners = () => {
    if (!runnersList || !runnersList.sort) {
      return runnersList
    }
    return runnersList.sort((a, b) => {
      const posA = a.runner_results[0]?.position
      const posB = b.runner_results[0]?.position
      if (!posA) return 1 // Place 'a' after 'b' if 'a' has no position
      if (!posB) return -1 // Place 'b' after 'a' if 'b' has no position
      return Number(posA - posB)
    });
  }

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
            {orderedRunners()?.map((runner) => {
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