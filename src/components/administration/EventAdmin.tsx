import {EventDetailModel} from "../../shared/EntityTypes.ts";
import EventAdminForm from "./EventAdminForm.tsx";
import {Container} from "@mui/material";
import React from "react";

function handleSubmit(event:React.FormEvent<HTMLFormElement>) {
  console.log(event)
  event.preventDefault()
}

export default function EventAdmin ()  {
  //const eventId = useRequiredParams<string>()
  //const [detail, setDetail] = useState<EventDetailModel>();

  /**useEffect(() => {
    if (eventId) {
        getEventDetail(eventId).then((response)=>{
            setDetail(response.data);
        }
        )
      }
    }, [eventId]);*/


  const detail:EventDetailModel = {
      id: "8f3b542c-23b9-4790-a113-b83d476c0ad9",
      description: "Test Foot-o",
      picture: 'null',
      website: 'null',
      scope: 'null',
      location: 'null',
      initial_date: "2024-01-25",
      final_date: "2024-01-25",
      federation_id: "FEDO",
      created: "2024-05-08T08:06:00.000+00:00",
      modified: "2024-05-08T08:06:00.000+00:00",
      stages: [
        {
          id: "51d63e99-5d7c-4382-a541-8567015d8eed",
          description: "First stage",
        }
      ],
      federation: {
        id: "FEDO",
        description: "FEDO SICO"
      }
  }
  return (

    <Container>
      <EventAdminForm eventDetail={detail} canEdit handleSubmit={handleSubmit}/>
    </Container>
  )
}