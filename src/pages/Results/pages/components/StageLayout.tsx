import {AppBar, BottomNavigation, BottomNavigationAction, Box, Typography} from "@mui/material";
import FootOStartTime from "../FootO/pages/StartTime/FootOStartTime.tsx";
import FootOResults from "../FootO/pages/Results/FootOResults.tsx";
import {AccessTime} from "@mui/icons-material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TimerIcon from "@mui/icons-material/Timer";
import TimelineIcon from '@mui/icons-material/Timeline';
import RelayResults from "../Relay/pages/RelayResults/RelayResults.tsx";
import RelaySplits from "../Relay/pages/RelaySplits/RelaySplits.tsx";
import RogaineResults from "../Rogaine/pages/RogaineResults/RogaineResults.tsx";
import RogainePoints from "../Rogaine/pages/RogainePoints/RogainePoints.tsx";
import {useEventInfo, useFetchClasses, useSelectedMenu} from "../../shared/hooks.ts";
import ClassSelector from "./ClassSelector.tsx";
import {useTranslation} from "react-i18next";
import FootOSplits from "../FootO/pages/Splits/FootOSplits.tsx";
import {SelectedClassContext} from "../../shared/context.ts";

function useStageComponent(stageTypeId:string):
  {defaultMenu:number,pages:JSX.Element[],menuOptions:JSX.Element[],menuOptionsLabels:string[]} {

  const {t} = useTranslation()

  switch (stageTypeId) {
    case "29d5050b-4769-4be5-ace4-7e5973f68e3c": //footO //TODO: use constant array
      return {
        defaultMenu:1,
        pages:[
          <FootOStartTime />,
          <FootOResults />,
          <FootOSplits />
        ],
        menuOptions:[
          <BottomNavigationAction key={"FootOStartTimeMenu"} label={t('StageHeader.StartTime')} icon={<AccessTime/>} />,
          <BottomNavigationAction key={"FootOResultsMenu"} label={t('StageHeader.Results')} icon={<EmojiEventsIcon />} />,
          <BottomNavigationAction key={"FootOSplitsMenu"} label={t('StageHeader.Splits')} icon={<TimerIcon />} />,
        ],
        menuOptionsLabels:['startTimes','results','splits']
      }

    case "9a918410-6dda-4c58-bec9-23839b336e59": //Relay //TODO: use constant array
      return {
        defaultMenu:0,
        pages:[
          <RelayResults />,
          <RelaySplits />
        ],
        menuOptions:[
          <BottomNavigationAction key={"RelayResultsMenu"} label={t('StageHeader.Results')} icon={<EmojiEventsIcon />} />,
          <BottomNavigationAction key={"RelaySplitsMenu"} label={t('StageHeader.Splits')} icon={<TimerIcon />} />,
        ],
        menuOptionsLabels:['results','splits']
      }

    case "2b5de3d0-9bc9-435a-8bd9-2d4060b86e45": //Rogaine //TODO: use constant array
      return {
        defaultMenu:0,
        pages:[
          <RogaineResults />,
          <RogainePoints />
        ],
        menuOptions:[
          <BottomNavigationAction key={"rogaineRseultsMenu"} label={t('StageHeader.Results')} icon={<EmojiEventsIcon />} />,
          <BottomNavigationAction key={"RogaineScorePointsMenu"} label={t('StageHeader.ScorePoints')} icon={<TimelineIcon />} />,
        ],
        menuOptionsLabels:['results','splits']
      }
    default:
      if (stageTypeId) {
        throw new Error("Unknown stage type " + stageTypeId);
      } else {//page is still loading
        return {
          defaultMenu:0,
          pages:[],
          menuOptions:[],
          menuOptionsLabels:[]
        }
      }
  }
}


export default function StageLayout () {
  const {t} = useTranslation()

  // Recover event info
  const {eventId,eventName,stageId,stageName,stageTypeId} = useEventInfo()

  // Get components for the stageTypeId
  const {defaultMenu,pages,menuOptions,menuOptionsLabels} = useStageComponent(stageTypeId)

  // Get functionality for the menu change
  const [selectedMenu,handleMenuChange] = useSelectedMenu(defaultMenu,menuOptionsLabels) //TODO: FIX BUG: it doesn't load properly

  // Get classes
  const [activeClass,setActiveClassId,classesList,areClassesLoading] = useFetchClasses(eventId,stageId)

  if (!stageTypeId) {
    return (<p>{t('Loading')}</p>)
  } else {
    console.log(defaultMenu)
    return (
      <>
        <Box sx={{
          height: "calc(100% - 64px)",
          padding: "24px 48px",
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0
        }}>
          <Box>
            <Typography sx={{
              fontWeight: "bold",
              paddingBottom: "1em",
            }}>{eventName} - {stageName}</Typography>
          </Box>
          <Box>
            <ClassSelector activeClass={activeClass} setActiveClassId={setActiveClassId} classesList={classesList} isLoading={areClassesLoading} />
          </Box>
          <Box sx={{marginTop: "12px", position: 'relative', flex: 1}}>
            <SelectedClassContext.Provider value={activeClass}>
              {pages[selectedMenu]}
            </SelectedClassContext.Provider>
          </Box>
        </Box>
        <AppBar position="static" sx={{backgroundColor: "white"}}>
          <BottomNavigation
            value={selectedMenu}
            onChange={(_,newValue)=> {handleMenuChange(newValue)}}
          >
            {menuOptions}
          </BottomNavigation>
        </AppBar>
      </>
    )
  }
}