import {List, ListItem} from "@mui/material";
import {getClassesInStage, getRunnersInStage} from "../../services/EventService.ts";
import {useParams} from "react-router-dom";



export default function EventRunners() {
  const {eventId,stageId} = useParams()



  return (<List>
    <ListItem>
      {eventId}
    </ListItem>
    <ListItem>
      {stageId}
    </ListItem>
  </List>)
}