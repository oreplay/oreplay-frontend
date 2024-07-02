import {Outlet, useNavigate} from "react-router-dom";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Container,
  Paper,
  Typography
} from "@mui/material";
import {useState} from "react";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TimerIcon from '@mui/icons-material/Timer';
import {useTranslation} from "react-i18next";
import ClassMenu from "./ClassMenu.tsx";
import {ClassModel, useRequiredParams} from "../../shared/EntityTypes.ts";
import {activeClassContext, runnerListContext} from "../../shared/Context.ts";
import {useRunners} from "../../services/EventService.ts";

export default function EventRunnersLayout() {
  const {eventId,stageId} = useRequiredParams<{eventId:string,stageId:string}>()//TODO: create context
  const [activeScreen, setActiveScreen] = useState(null); //TODO set it to results if loading it directly
  const navigate = useNavigate()
  const {t} = useTranslation()

  const [activeClass,setActiveClass] = useState<ClassModel|null>(null)
  const [runnerList,areRunnersLoading] = useRunners(eventId,stageId,activeClass);

  return (
    <Box
      height={'100%'}
    >
      <Box bgcolor="secondary.light">
        <Container sx={{paddingY:'10px'}}>
          {// TODO: implement real names
          }
          <Typography color={'secondary.main'}>Event name</Typography>
          <Typography color={'text.secondary'}>Stage name</Typography>
        </Container>
      </Box>

      <activeClassContext.Provider value={activeClass}>
        <runnerListContext.Provider value={[runnerList,areRunnersLoading]} >
          <Outlet />
        </runnerListContext.Provider>
      </activeClassContext.Provider>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} >
        <BottomNavigation
          value={activeScreen}
          onChange={(_,newValue)=> {
            // highlight screen
            setActiveScreen(newValue)

            // navigation options
            if (newValue === 1) {navigate('start-list')}
            if (newValue === 2) {navigate('results')}
            if (newValue === 3) {navigate('splits')}
          }}
        >
          <ClassMenu
            activeClass={activeClass}
            setActiveClass={setActiveClass}
            eventId={eventId}
            stageId={stageId}
          />
          <BottomNavigationAction label={t('Results.start list')} icon={<FormatListBulletedIcon/>} />{// TODO change Icon
        }
          <BottomNavigationAction label={t('Results.results')} icon={<EmojiEventsIcon />} />
          <BottomNavigationAction label={t('Results.splits')} icon={<TimerIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  )
}