import {BottomNavigation, BottomNavigationAction, Box, IconButton, Paper} from "@mui/material";
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
import {useEventInfo, useFetchClasses, useRunners, useSelectedMenu} from "../../shared/hooks.ts";
import ClassSelector from "./ClassSelector.tsx";
import {useTranslation} from "react-i18next";
import FootOSplits from "../FootO/pages/Splits/FootOSplits.tsx";
import {RunnersContext, SelectedClassContext} from "../../shared/context.ts";
import EventStageBanner from "./EventStageBanner.tsx";
import RefreshIcon from '@mui/icons-material/Refresh';
import Tooltip from "@mui/material/Tooltip";

const FOOT_O_MENU_OPTIONS_LABELS = ['startTimes','results','splits'];
const RELAY_MENU_OPTIONS_LABELS = ['results','splits'];
const ROGAINING_MENU_OPTIONS_LABELS = ['results','splits'];
const EMPTY_MENU_OPTIONS_LABELS: string[] = [];


function useStageComponent(stageTypeId:string):
  {defaultMenu:number,pages:JSX.Element[],menuOptions:JSX.Element[],menuOptionsLabels:string[]} {

  const {t} = useTranslation()

  const FOOT_O = "29d5050b-4769-4be5-ace4-7e5973f68e3c"//TODO: use constants from external file
  const RELAY = "9a918410-6dda-4c58-bec9-23839b336e59"
  const ROGAINING = "2b5de3d0-9bc9-435a-8bd9-2d4060b86e45"

  switch (stageTypeId) {
    case FOOT_O:
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
        menuOptionsLabels: FOOT_O_MENU_OPTIONS_LABELS
      }

    case RELAY:
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
        menuOptionsLabels: RELAY_MENU_OPTIONS_LABELS
      }

    case ROGAINING:
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
        menuOptionsLabels: ROGAINING_MENU_OPTIONS_LABELS
      }
    default:
      if (stageTypeId) {
        throw new Error("Unknown stage type " + stageTypeId);
      } else {//page is still loading
        return {
          defaultMenu:0,
          pages:[],
          menuOptions: [],
          menuOptionsLabels: EMPTY_MENU_OPTIONS_LABELS
        }
      }
  }
}


export default function StageLayout () {
  const {t} = useTranslation()

  // Recover event info
  const {eventId,eventName,stageId,stageName,stageTypeId,singleStage} = useEventInfo()

  // Get components for the stageTypeId
  const {defaultMenu,pages,menuOptions,menuOptionsLabels} = useStageComponent(stageTypeId)

  // Get functionality for the menu change
  const [selectedMenu,handleMenuChange] = useSelectedMenu(defaultMenu,menuOptionsLabels)

  // Get classes
  const [activeClass,setActiveClassId,classesList,areClassesLoading,refreshClasses] = useFetchClasses(eventId,stageId)

  // Get runners
  const [runnersList,areRunnersLoading,refreshRunners] = useRunners(eventId,stageId,activeClass)

  // Refresh button
  const handleRefreshClick = () => {
    refreshClasses()
    refreshRunners()
  }

  if (!stageTypeId) {
    return (<p>{t('Loading')}</p>)
  } else {
    return (
      <>
        <EventStageBanner eventName={eventName} stageName={stageName} singleStage={singleStage} />
        <Box sx={{
          height: "calc(100% - 64px)",
          padding: "24px 24px",
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0
        }}>
          <Box sx={{
            display:'flex',
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center',
            maxWidth:'600px'
          }}>
            <ClassSelector activeClass={activeClass} setActiveClassId={setActiveClassId} classesList={classesList} isLoading={areClassesLoading} />
            <Tooltip title={t('')}>
              <IconButton onClick={() => handleRefreshClick()}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{marginTop: "12px", flex: 1, paddingBottom: '56px'}}>
            <SelectedClassContext.Provider value={activeClass}>
              <RunnersContext.Provider value={[runnersList,areRunnersLoading]}>
                {pages[selectedMenu]}
              </RunnersContext.Provider>
            </SelectedClassContext.Provider>
          </Box>
        </Box>
        <Paper sx={{position: "fixed", bottom: 0, right: 0, left:0}}>
          <BottomNavigation
            value={selectedMenu}
            onChange={(_,newValue)=> {handleMenuChange(newValue)}}
          >
            {menuOptions}
          </BottomNavigation>
        </Paper>

      </>
    )
  }
}