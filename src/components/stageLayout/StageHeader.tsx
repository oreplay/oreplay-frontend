import {AccessTime, EmojiEvents, HorizontalSplit} from "@mui/icons-material";
import {AppBar, Box, IconButton, Toolbar, Tooltip, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate, useParams} from "react-router-dom";

export default function StageHeader() {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {eventId, stageId} = useParams();
  const [selectedMenu, setSelectedMenu] = useState(1);

  function changeSelectedMenu(newValueSelected: number) {
    setSelectedMenu(newValueSelected);
  }

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
        <Toolbar sx={{display: "flex", justifyContent: "space-between"}}>
          <Box>
            <Tooltip title={t('StageHeader.Departures')}>
              <IconButton color={selectedMenu == 0 ? "secondary" : "primary"}
                sx={{display: "flex", flexDirection: "column"}}
                onClick={() => {
                  changeSelectedMenu(0);
                }}>
                <AccessTime/>
                <Typography>{t("StageHeader.Departures")}</Typography>
              </IconButton>
            </Tooltip>
          </Box>
          <Box>
            <Tooltip title={t('StageHeader.Results')}>
              <IconButton color={selectedMenu == 1 ? "secondary" : "primary"}
                sx={{display: "flex", flexDirection: "column"}}
                onClick={
                  () => {
                    changeSelectedMenu(1);
                  }}>
                <EmojiEvents/>
                <Typography>{t("StageHeader.Results")}</Typography>
              </IconButton>
            </Tooltip>
          </Box>
          <Box>
            <Tooltip title={t('StageHeader.Splits')}>
              <IconButton color={selectedMenu == 2 ? "secondary" : "primary"}
                sx={{display: "flex", flexDirection: "column"}}
                onClick={() => {
                  changeSelectedMenu(2);
                }}>
                <HorizontalSplit/>
                <Typography>{t("StageHeader.Splits")}</Typography>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}