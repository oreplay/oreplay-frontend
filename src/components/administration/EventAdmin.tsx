import {EventDetailModel, useRequiredParams} from "../../shared/EntityTypes.ts";
import EventAdminForm from "./EventAdminForm.tsx";
import {Box, Container, Typography} from "@mui/material";
import {useAuth, useEventDetail} from "../../shared/hooks.ts";
import {useTranslation} from "react-i18next";
import StagesDataGrid from "./StagesDataGrid.tsx";
import EventTokenDataGrid from "./EventTokenDataGrid.tsx";
import DeleteEventButton from "./DeleteEventButton.tsx";
import React, {useState} from "react";
import {patchEvent} from "../../services/EventService.ts";
import {DateTime} from "luxon";


export default function EventAdmin ()  {
  const {eventId} = useRequiredParams<{ eventId:string }>()
  const [detail,isLoadingEventData]=useEventDetail(eventId)
  const {t} = useTranslation()
  const {token} = useAuth()

  // Functions to handle Event update
  const [isEventEditing,setIsEventEditing] = useState<boolean>(false)
  const handleUpdateEvent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget);
    const response = patchEvent(
      eventId,
      data.get('description') as string,
      DateTime.fromFormat(data.get('startDate') as string,'dd/MM/yyyy').toSQLDate() as string,
      DateTime.fromFormat(data.get('endDate') as string,'dd/MM/yyyy').toSQLDate() as string,
      data.get('scope') as string,
      !!data.get('isPublic'),
      token as string,
      data.get('website')? data.get('website') as string : undefined
    )
    response.then(
      () => {
        setIsEventEditing(false)
      },
      ()=>console.log("Create event failed",response)
    )
  }

  const handleCancelEditingEvent = () => {
    setIsEventEditing(false)
    //BUG, return to previous state
    // BUG, Public cannot be edited
  }

  const handleClickEditEvent = () => setIsEventEditing(true)


  return (
    <Container>
      {isLoadingEventData ? <p>Loading...</p>
        : <Container>
          <Box sx={{marginY:'2em'}}>
            <Typography variant={'h3'}>{t('EventAdmin.EventData')}</Typography>
            <EventAdminForm
              eventDetail={detail as EventDetailModel}
              handleCancel={handleCancelEditingEvent}
              handleEdit={handleClickEditEvent}
              handleSubmit={handleUpdateEvent}
              canEdit={isEventEditing}
            />
          </Box>
          <Box sx={{marginY:'2em'}}>
            <Typography variant={'h3'}>{t('Stages')}</Typography>
            {detail ? <StagesDataGrid eventDetail={detail} /> : <></> }
          </Box>
          <Box sx={{marginY:'2em'}}>
            <Typography variant={'h3'}>{t('EventAdmin.EventSecurityTokens')}</Typography>
            <EventTokenDataGrid event_id={detail? detail.id : ""} />
          </Box>
          <Box sx={{marginY:'2em'}}>
            <Typography variant={'h3'}>{t('EventAdmin.DangerArea')}</Typography>
            {detail? <DeleteEventButton event={detail} /> : <></> }
          </Box>
        </Container>
      }
    </Container>
  )
}