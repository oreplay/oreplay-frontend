import {Container} from "@mui/material";
import {useParams} from "react-router-dom";

export default function EventAdmin() {
  const eventId = useParams()


  return (
    <Container>
      Event
    </Container>
  )
}