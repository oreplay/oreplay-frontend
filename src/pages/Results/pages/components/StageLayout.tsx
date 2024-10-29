import {useLocation, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getStageDetail} from "../../services/EventService.ts";
import {useAuth} from "../../../../shared/hooks.ts";
import {BottomNavigationAction, Box, Typography} from "@mui/material";
import ResultMenuSelector from "./ResultMenuSelector.tsx";
import FootOStartTime from "../FootO/pages/StartTime/FootOStartTime.tsx";
import FootOResults from "../FootO/pages/Results/FootOResults.tsx";
import {AccessTime} from "@mui/icons-material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TimerIcon from "@mui/icons-material/Timer";
import TimelineIcon from '@mui/icons-material/Timeline';
import {useTranslation} from "react-i18next";
import RelayResults from "../Relay/pages/RelayResults/RelayResults.tsx";
import RelaySplits from "../Relay/pages/RelaySplits/RelaySplits.tsx";
import RogaineResults from "../Rogaine/pages/RogaineResults/RogaineResults.tsx";
import RogainePoints from "../Rogaine/pages/RogainePoints/RogainePoints.tsx";

export default function StageLayout () {
  const {token} = useAuth()
  const {t} = useTranslation()

  // Recover event info
  const {eventId, stageId} = useParams()
  const {state} = useLocation()

  const [eventName, setEventName] = useState<string>("")
  const [stageName, setStageName] = useState<string>("")
  const [stageTypeId, setStageTypeId] = useState<string>("")
  useEffect(
    () => {
      //Check if state is empty. If it is, gather info from backend. It will ve empty if the user has not landed in this page navigating
      if (state === null) {
        console.log("Null states")
        getStageDetail(eventId as string,stageId as string,token).then(
          (response) => {
            setEventName(""); //TODO: modify back to get this info
            setStageName(response.data.description)
            setStageTypeId(response.data.stage_type.id)
          }
        )

      //Stage info came from router state. No extra backend call requiered
      } else {
        setEventName(state.eventName)
        setStageName(state.stageName)
        setStageTypeId(state.stageTypeId)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ,[])


  const renderStageComponent = () => {
    switch (stageTypeId) {
      case "29d5050b-4769-4be5-ace4-7e5973f68e3c": //footO //TODO: use constant array
        return (
          <ResultMenuSelector
            defaultMenu={1}
            pages={[
              <FootOStartTime />,
              <FootOResults />,
              <FootOStartTime />
            ]}
            menuOptions={
              [
                <BottomNavigationAction key={"FootOStartTimeMenu"} label={t('StageHeader.StartTime')} icon={<AccessTime/>} />,
                <BottomNavigationAction key={"FootOResultsMenu"} label={t('StageHeader.Results')} icon={<EmojiEventsIcon />} />,
                <BottomNavigationAction key={"FootOSplitsMenu"} label={t('StageHeader.Splits')} icon={<TimerIcon />} />,
              ]
            }
            menuOptionsLabels={['startTimes','results','splits']}
          />
        )
      case "9a918410-6dda-4c58-bec9-23839b336e59": //Relay //TODO: use constant array
        return (
          <ResultMenuSelector
            defaultMenu={0}
            pages={[
              <RelayResults />,
              <RelaySplits />
            ]}
            menuOptions={
              [
                <BottomNavigationAction key={"RelayResultsMenu"} label={t('StageHeader.Results')} icon={<EmojiEventsIcon />} />,
                <BottomNavigationAction key={"RelaySplitsMenu"} label={t('StageHeader.Splits')} icon={<TimerIcon />} />,
              ]
            }
            menuOptionsLabels={['results','splits']}
          />
        )

      case "2b5de3d0-9bc9-435a-8bd9-2d4060b86e45": //Rogaine //TODO: use constant array
        return <ResultMenuSelector
          defaultMenu={0}
          pages={[
            <RogaineResults />,
            <RogainePoints />
          ]}
          menuOptions={
            [
              <BottomNavigationAction key={"rogaineRseultsMenu"} label={t('StageHeader.Results')} icon={<EmojiEventsIcon />} />,
              <BottomNavigationAction key={"RogaineScorePointsMenu"} label={t('StageHeader.ScorePoints')} icon={<TimelineIcon />} />,
            ]
          }
          menuOptionsLabels={['results','splits']}
        />
    }
  }

  return (
    <>
      {/**<p>{eventId} {stageId} {state.stageName} {state.eventName} {state.stageTypeId}</p>}**/}
      <Box sx={{height: "100%", width: "100%", display: "flex", flexDirection: "column"}}>
        <Typography sx={{
          fontWeight: "bold",
          paddingTop: "46px",
          paddingLeft: "46px"
        }}>{eventName} - {stageName}</Typography>
        {renderStageComponent()}
      </Box>
    </>
  )

}