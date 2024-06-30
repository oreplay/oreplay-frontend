import {Outlet, useLocation, useNavigate, useParams} from "react-router-dom";
import {BottomNavigation, BottomNavigationAction, Box, Paper} from "@mui/material";
import {useState} from "react";
import {ClassModel} from "../../shared/EntityTypes.ts";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TimerIcon from '@mui/icons-material/Timer';
import {useTranslation} from "react-i18next";

export default function EventRunnersLayout() {

  const [activeScreen, setActiveScreen] = useState(null); //TODO set it to results if loading it directly
  const navigate = useNavigate()
  const {t} = useTranslation()

  //const [activeClass,setActiveClass] = useState<ClassModel|null>(null)
  //getClassesInStage(eventId,stageId).then((response) => {setActiveClass(response.data[0])});
  // TODO: Classes into the navigation

  return (
    <Box
      height={'100%'}
    >
      <Outlet />
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} >
        <BottomNavigation
          value={activeScreen}
          onChange={(_,newValue)=> {
            //highlight screen
            setActiveScreen(newValue)

            //navigate to right screen
            if (newValue===0) {navigate('start-list')}
            if (newValue===1) {navigate('results')}
            if (newValue===2) {navigate('splits')}
          }}
        >
          <BottomNavigationAction label={t('Results.start list')} icon=<FormatListBulletedIcon/> />{// TODO change Icon
         }
          <BottomNavigationAction label={t('Results.results')} icon=<EmojiEventsIcon/> />
          <BottomNavigationAction label={t('Results.splits')} icon=<TimerIcon/> />
        </BottomNavigation>
      </Paper>
    </Box>
  )
}