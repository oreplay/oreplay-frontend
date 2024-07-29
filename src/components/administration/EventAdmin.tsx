import {EventDetailModel, useRequiredParams} from "../../shared/EntityTypes.ts";
import EventAdminForm from "./EventAdminForm.tsx";
import {Box, Container, Typography} from "@mui/material";
import {useEventDetail} from "../../shared/hooks.ts";
import {useTranslation} from "react-i18next";
import StagesDataGrid from "./StagesDataGrid.tsx";
import EventTokenDataGrid from "./EventTokenDataGrid.tsx";


export default function EventAdmin ()  {
  const {eventId} = useRequiredParams<{ eventId:string }>()
  const [detail,isLoadingEventData]=useEventDetail(eventId)
  const {t} = useTranslation()


  return (
    <Container>
      {isLoadingEventData ? <p>Loading...</p>
        : <Container>
          <Box sx={{marginY:'2em'}}>
            <EventAdminForm
              eventDetail={detail as EventDetailModel}
            />
          </Box>
          <Box sx={{marginY:'2em'}}>
            <Typography>{t('Stages')}</Typography>
            {detail ? <StagesDataGrid eventDetail={detail} /> : <></> }
          </Box>
          <Box sx={{marginY:'2em'}}>
            <Typography>{t('EventAdmin.EventSecurityTokens')}</Typography>
            <Typography>{t('EventAdmin.EventId')+`: ${detail?.id}`}</Typography>
            <EventTokenDataGrid event_id={detail? detail.id : ""} />
          </Box>
        </Container>
      }

    </Container>
  )
}