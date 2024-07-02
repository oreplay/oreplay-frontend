import {Container, List} from "@mui/material";
import {useContext} from "react";
import {runnerListContext} from "../../../shared/Context.ts";
import FootORunnerResultItem from "./FootORunnerResultItem.tsx";

export default function FootOResults() {
  const [runnerList,areRunnersLoading] = useContext(runnerListContext); //TODO: moveRunners to a context

  if (areRunnersLoading) {
    return <p>Loading...</p>
  } else if (runnerList === null) {
    return <p>Choose a class</p>
  } else {
    return (
      <Container>
        <List>
          {runnerList.map((runner) => (
            <FootORunnerResultItem runner={runner} />
          ))}
        </List>
      </Container>
    )
  }

}