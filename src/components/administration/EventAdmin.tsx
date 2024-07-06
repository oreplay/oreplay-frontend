import {EventDetailModel, useRequiredParams} from "../../shared/EntityTypes.ts";
import EventAdminForm from "./EventAdminForm.tsx";
import {Container} from "@mui/material";
import {useEventDetail} from "../../shared/hooks.ts";

export default function EventAdmin ()  {
  const {eventId} = useRequiredParams<{ eventId:string }>()

  const [detail,isLoading]=useEventDetail(eventId)
  return (
    <Container>
      {isLoading ? <p>Loading...</p>
        : <EventAdminForm
          eventDetail={detail as EventDetailModel}
        />
      }
    </Container>
  )
}