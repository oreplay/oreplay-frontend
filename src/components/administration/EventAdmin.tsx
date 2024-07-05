import {EventDetailModel, useRequiredParams} from "../../shared/EntityTypes.ts";
import EventAdminForm from "./EventAdminForm.tsx";
import {Container} from "@mui/material";
import React from "react";
import {useEventDetail} from "../../shared/hooks.ts";

function handleSubmit(event:React.FormEvent<HTMLFormElement>) {
  console.log(event)
  event.preventDefault()
}

export default function EventAdmin ()  {
  const {eventId} = useRequiredParams<{ eventId:string }>()

  const [detail,isLoading]=useEventDetail(eventId)
  return (
    <Container>
      {isLoading ? <p>Loading...</p>
        : <EventAdminForm eventDetail={detail as EventDetailModel} canEdit
                          handleSubmit={handleSubmit}/>
      }
    </Container>
  )
}