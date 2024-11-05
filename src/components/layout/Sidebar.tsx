import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Theme, useTheme } from "@mui/material";
import EventIcon from '@mui/icons-material/Event';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"

type Props = {
  openSidebar: boolean,
  setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>
}
export default function Sidebar({openSidebar, setOpenSidebar}: Props) {
  const theme: Theme = useTheme();
  const navigate = useNavigate();

  /* Language support */
  const { t } = useTranslation()

  /* Component */
  return (
    <Box>
      <Drawer
        ModalProps={{
          BackdropProps: {
            invisible: true,
          }
        }}
        anchor="right"
        open={openSidebar}
        onClose={() => setOpenSidebar(prev => !prev)}
        sx={{
          '&.MuiDrawer-root .MuiDrawer-paper': {
            background: theme.palette.primary.main,
            mt: "64px"
          }
        }}
      >
        <List>
          <ListItem>
            <ListItemButton onClick={() => {navigate("/competitions"); setOpenSidebar(prev => !prev)}}>
              <ListItemIcon sx= {{color: "white"}}>
                <EventIcon/>
              </ListItemIcon>
              <ListItemText sx= {{color: "white"}} primary={t("Events")}/>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => {navigate("/About-us"); setOpenSidebar(prev => !prev)}}>
              <ListItemIcon sx= {{color: "white"}}>
                <InfoIcon/>
              </ListItemIcon>
              <ListItemText sx= {{color: "white"}} primary={t("AboutUs.AboutUs")}/>
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  )
}