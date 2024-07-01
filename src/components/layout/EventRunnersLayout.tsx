import {Outlet, useNavigate} from "react-router-dom";
import {BottomNavigation, BottomNavigationAction, Box, Paper} from "@mui/material";
import {useState} from "react";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TimerIcon from '@mui/icons-material/Timer';
import {useTranslation} from "react-i18next";
import ClassMenu from "./ClassMenu.tsx";
import {ClassModel, useRequiredParams} from "../../shared/EntityTypes.ts";

export default function EventRunnersLayout() {
  const {eventId,stageId} = useRequiredParams<{eventId:string,stageId:string}>()
  const [activeScreen, setActiveScreen] = useState(null); //TODO set it to results if loading it directly
  const navigate = useNavigate()
  const {t} = useTranslation()

  const [activeClass,setActiveClass] = useState<ClassModel|null>(null)

  return (
    <Box
      height={'100%'}
    >
      <Outlet />
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