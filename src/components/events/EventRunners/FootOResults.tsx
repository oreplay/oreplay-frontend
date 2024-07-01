import {List, ListItem, ListItemText} from "@mui/material";
import {useRunners} from "../../../services/EventService.ts";
import {useRequiredParams} from "../../../shared/EntityTypes.ts";
import {useContext} from "react";
import {activeClassContext} from "../../../shared/Context.ts";

export default function FootOResults() {
  // TODO avoid making too many repeated request. Make footer and split into several components
  const activeClass = useContext(activeClassContext);
  const {eventId,stageId} = useRequiredParams<{eventId:string,stageId:string}>();
  const [runnerList,areRunnersLoading] = useRunners(eventId,stageId,activeClass); //TODO: moveRunners to a context

  if (areRunnersLoading) {
    return <p>Loading</p>
  } else {
    return (
      <List>
        {runnerList.map((runner) => (
          <ListItem key={runner.id}>
            <ListItemText>
              {runner.first_name} {runner.last_name}
            </ListItemText>
          </ListItem>
        ))}
      </List>
    )
  }

}