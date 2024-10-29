import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import {getRunnersInStage} from "../../../../services/EventService.ts";
import {useTranslation} from "react-i18next";
import {RunnerModel} from "../../../../../../shared/EntityTypes.ts";
import {parseDateOnlyTime} from "../../../../../../shared/Functions.tsx";

export default function FootOResults() {
  const [runnersData, setRunnersData] = useState<RunnerModel[] | null>(null);
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

  useEffect(() => {
    if (eventId !== undefined && stageId !== undefined) {
      getClassesInStage(eventId, stageId).then((response) => {
        setClassesList(response.data);
      });
    }
  }, [eventId, stageId])

  useEffect(() => {
    if (selectedCategory !== null && selectedCategory !== undefined && eventId !== undefined && stageId !== undefined) {
      getRunnersInStage(eventId, stageId, selectedCategory).then((response) => {
        setRunnersData(response.data);
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory])

  const handleChangeClass = (event: { target: { value: SetStateAction<string | undefined>; }; }) => {
    setSelectedCategory(event.target.value);
  }

  return (
    <Box sx={{marginTop: "12px", position: 'relative', flex: 1}}>
      <TableContainer sx={{height: '100%', flex: 1, position: 'absolute'}}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
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
                <TableRow sx={{width: {md: "100%", sx: "200px"}}}>
                  <TableCell>{runner.runner_results[0].position.toString()}</TableCell>
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
    </Box>

  )
}