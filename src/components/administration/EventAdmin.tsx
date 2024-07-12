import {EventDetailModel, useRequiredParams} from "../../shared/EntityTypes.ts";
import EventAdminForm from "./EventAdminForm.tsx";
import {Container, Typography} from "@mui/material";
import {useEventDetail} from "../../shared/hooks.ts";
import {useTranslation} from "react-i18next";
import StagesDataGrid from "./StagesDataGrid.tsx";


export default function EventAdmin ()  {
  const {eventId} = useRequiredParams<{ eventId:string }>()
  const [detail,isLoadingEventData]=useEventDetail(eventId)
  const {t} = useTranslation()


  return (
    <Container>
      {isLoadingEventData ? <p>Loading...</p>
        : <>
            <EventAdminForm
              eventDetail={detail as EventDetailModel}
            />
            <Typography>{t('Stages')}</Typography>
            {detail ? <StagesDataGrid eventDetail={detail} /> : <></> }
          </>
      }

    </Container>
  )
}