import {
  AppBar,
  BottomNavigation, BottomNavigationAction,
  Box,
} from "@mui/material";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate, useParams} from "react-router-dom";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TimerIcon from '@mui/icons-material/Timer';
import {AccessTime} from "@mui/icons-material";

export default function StageHeader() {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {eventId, stageId} = useParams();
  const [selectedMenu, setSelectedMenu] = useState(1);

  useEffect(() => {
    switch (selectedMenu) {
      case 0:
        navigate(`/competitions/${eventId}/${stageId}/startList`);
        break;
      case 1:
        navigate(`/competitions/${eventId}/${stageId}/results`);
        break;
      case 2:
        navigate(`/competitions/${eventId}/${stageId}/splits`);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMenu]);

  return (
    <Box sx={{marginTop: "auto", width: "100%"}}>
      <AppBar position="static" sx={{backgroundColor: "white"}}>
        <BottomNavigation
          value={selectedMenu}
          onChange={(_,newValue)=> {setSelectedMenu(newValue)}}
        >
          <BottomNavigationAction label={t('StageHeader.StartTime')} icon={<AccessTime/>} />
          <BottomNavigationAction label={t('StageHeader.Results')} icon={<EmojiEventsIcon />} />
          <BottomNavigationAction label={t('StageHeader.Splits')} icon={<TimerIcon />} />
        </BottomNavigation>
      </AppBar>
    </Box>
  )
}