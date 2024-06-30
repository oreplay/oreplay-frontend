import {Outlet, useNavigate} from "react-router-dom";
import {BottomNavigation, BottomNavigationAction, Box, Paper, Typography} from "@mui/material";
import {useState} from "react";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TimerIcon from '@mui/icons-material/Timer';
import {useTranslation} from "react-i18next";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";

export default function EventRunnersLayout() {

  const [activeScreen, setActiveScreen] = useState(null); //TODO set it to results if loading it directly
  const navigate = useNavigate()
  const {t} = useTranslation()
  const [isMenuOpen, setMenuOpen] = useState(false);

  const [activeClass,setActiveClass] = useState<string>('CAT.')
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
            // highlight screen
            setActiveScreen(newValue)

            // navigation options
            if (newValue === 1) {navigate('start-list')}
            if (newValue === 2) {navigate('results')}
            if (newValue === 3) {navigate('splits')}
          }}
        >
          <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
            <Button sx={{m:'auto'}}
              onClick={()=>{setMenuOpen(!isMenuOpen)}}
            >
              <Typography color='text.secondary'>{activeClass}</Typography>
            </Button>

              <Menu
                open={isMenuOpen}
              >
                <MenuItem onClick={()=>{setActiveClass('Cat-1');setMenuOpen(false)}}>Cat-1</MenuItem>
                <MenuItem onClick={()=>{setActiveClass('Cat-2');setMenuOpen(false)}}>Cat-2</MenuItem>
              </Menu>
          </Box>
          <BottomNavigationAction label={t('Results.start list')} icon=<FormatListBulletedIcon/> />{// TODO change Icon
         }
          <BottomNavigationAction label={t('Results.results')} icon=<EmojiEventsIcon/> />
          <BottomNavigationAction label={t('Results.splits')} icon=<TimerIcon/> />
        </BottomNavigation>
      </Paper>
    </Box>
  )
}