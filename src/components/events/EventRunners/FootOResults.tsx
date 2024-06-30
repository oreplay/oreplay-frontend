import {List, ListItem, ListItemText} from "@mui/material";
import {getClassesInStage, getRunnersInStage} from "../../../services/EventService.ts";
import {useParams} from "react-router-dom";
import {ClassModel, RunnerModel} from "../../../shared/EntityTypes.ts";
import {useEffect, useState} from "react";



export default function FootOResults() {
  // TODO avoid making too many repeated request. Make footer and split into several components

  const {eventId,stageId} = useParams()
  const [runnerList,setRunnerList] = useState<RunnerModel[]>([]);
  const [activeClass,setActiveClass] = useState<ClassModel|null>(null)
  getClassesInStage(eventId,stageId).then((response) => {setActiveClass(response.data[0])});
  console.log(activeClass);
  useEffect(() => {
    getRunnersInStage(eventId,stageId).then((response)=>{console.log(response); setRunnerList(response.data)})
  },[activeClass]);

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