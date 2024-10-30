import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import {SetStateAction, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getClassesInStage, getRunnersInStage} from "../../services/EventService";
import {ClassModel, RunnerModel} from "../../shared/EntityTypes";
import {useTranslation} from "react-i18next";
import {parseDateOnlyTime} from "../../shared/Functions";

export default function ResultsStage() {
  const {eventId, stageId} = useParams();
  const [classesList, setClassesList] = useState<ClassModel[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [runnersData, setRunnersData] = useState<RunnerModel[] | null>(null);
  const [widthWindow, setWidthWindow] = useState<number>(0);
  const {t} = useTranslation();

  const handleWindowSizeChange = () => {
    setWidthWindow(window.innerWidth);
  };

  const orderedRunners = () => {
    if (!runnersData || !runnersData.sort) {
      return runnersData
    }
    return runnersData.sort((a, b) => {
      const posA = a.runner_results[0]?.position
      const posB = b.runner_results[0]?.position
      if (!posA) return 1 // Place 'a' after 'b' if 'a' has no position
      if (!posB) return -1 // Place 'b' after 'a' if 'b' has no position
      return Number(posA - posB)
    });
  }
  const finishTimeWithPoints = (runner) => {
    const hasPoints = runner.runner_results[0].points_final !== undefined && runner.runner_results[0].points_final > 0
    return (runner.runner_results[0].finish_time != null ? parseDateOnlyTime(runner.runner_results[0].finish_time) : "-") +
      (hasPoints ? ` (${runner.runner_results[0].points_final})` : "")
  }

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
    <Box sx={{
      height: "calc(100% - 64px)",
      padding: "24px 48px",
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0
    }}>
      <Box>
        <FormControl sx={{minWidth: '10em'}} required>
          <InputLabel>{t('ResultsStage.Class')}</InputLabel>
          <Select
            label={t('ResultsStage.Class')}
            onChange={handleChangeClass}
          >
            {classesList?.map(
              (category) => {
                return (
                  <MenuItem value={category.id}>{category.short_name}</MenuItem>
                )
              }
            )}
          </Select>
        </FormControl>
      </Box>
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
              {orderedRunners()?.map((runner) => {
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
                        <Typography>{finishTimeWithPoints(runner)}</Typography>
                      </TableCell>}
                    {widthWindow > 768 ? (
                      <TableCell>{finishTimeWithPoints(runner)}</TableCell>
                    ) : null}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

    </Box>
  )
}