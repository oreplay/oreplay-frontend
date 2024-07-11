import {EventDetailModel, useRequiredParams} from "../../shared/EntityTypes.ts";
import EventAdminForm from "./EventAdminForm.tsx";
import {Container, Typography} from "@mui/material";
import {useEventDetail} from "../../shared/hooks.ts";
import {useTranslation} from "react-i18next";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {useEffect, useState} from "react";

interface StageRowsInterface {
  id:string,
  stageDate:string,
  stageName:string,
}

export default function EventAdmin ()  {
  const {eventId} = useRequiredParams<{ eventId:string }>()
  const [detail,isLoadingEventData]=useEventDetail(eventId)
  const {t} = useTranslation()

  const StagesColumns:GridColDef[] = [
    {field:'stageDate',headerName:t('Dates'),width:150},
    {field:'stageName',headerName:t('Name'),width:150}
  ]

  const [stageRows,setStageRows] = useState<StageRowsInterface[]>([])
  useEffect(() => {
    if (detail) {
      setStageRows(detail.stages.map(
        (stage):StageRowsInterface=>(
            {id:stage.id, stageDate:'To implement', stageName:stage.description }
          )
        )
      )
    }

  }, [detail]);



  return (
    <Container>
      {isLoadingEventData ? <p>Loading...</p>
        : <>
          <EventAdminForm
            eventDetail={detail as EventDetailModel}
          />
          <Typography>{t('Stages')}</Typography>
          <DataGrid columns={StagesColumns} rows={stageRows} />
          </>
      }

    </Container>
  )
}