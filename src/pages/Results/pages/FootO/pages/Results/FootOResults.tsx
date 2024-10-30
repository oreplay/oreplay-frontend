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
import {getRunnersInStage} from "../../../../services/EventService.ts";
import {useTranslation} from "react-i18next";
import {RunnerModel} from "../../../../../../shared/EntityTypes.ts";
import {parseDateOnlyTime} from "../../../../../../shared/Functions.tsx";
import {SelectedClassContext} from "../../../../shared/context.ts";
import {useEventInfo} from "../../../../shared/hooks.ts";

export default function FootOResults() {
  const [isLoading,setIsLoading] = useState<boolean>(true)
  const [runnersData, setRunnersData] = useState<RunnerModel[] | null>(null);
  const [widthWindow, setWidthWindow] = useState<number>(0);
  const {t} = useTranslation();

  const {eventId,stageId} = useEventInfo()
  const selectedClass = useContext(SelectedClassContext);

  const handleWindowSizeChange = () => {
    setWidthWindow(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, [])


  useEffect(() => {
    if (selectedClass !== null && selectedClass !== undefined && eventId !== undefined && stageId !== undefined) {
      getRunnersInStage(eventId, stageId, selectedClass.id).then((response) => {
        setRunnersData(response.data);
      })
      setIsLoading(false)

      return () => setIsLoading(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClass])

  console.log("Runners Data ",runnersData)

  if (isLoading) {
    return (<p>{t('Loading')}</p>)
  } else {
    return (
      <TableContainer sx={{height: '100%', flex: 1, position: 'absolute'}}>
        <Table key={`${eventId}-${selectedClass}`} stickyHeader>
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
            {runnersData?.map((runner) => {
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
                    <TableCell>{parseDateOnlyTime(runner.runner_results[0].start_time)}</TableCell>
                  ) :
                    <TableCell>
                      <Typography>{parseDateOnlyTime(runner.runner_results[0].start_time)}</Typography>
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