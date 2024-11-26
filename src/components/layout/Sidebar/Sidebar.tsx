import {
  Box, Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import EventIcon from '@mui/icons-material/Event';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import LanguageDropdown from "./components/LanguageDropdown.tsx";
import AuthenticationSidebarItem from "./components/AuthenticationSidebarItem.tsx";

type Props = {
  openSidebar: boolean,
  setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>
}
export default function Sidebar({openSidebar, setOpenSidebar}: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
            background: 'white',
          }
        }}
      >
        {/* Close button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 1, // Padding for spacing
          }}
        >
          <IconButton onClick={() => setOpenSidebar((prev) => !prev)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          <ListItem>
            <ListItemButton onClick={() => {navigate("/competitions"); setOpenSidebar(prev => !prev)}}>
              <ListItemIcon>
                <EventIcon/>
              </ListItemIcon>
              <ListItemText primary={t("Events")}/>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => {navigate("/About-us"); setOpenSidebar(prev => !prev)}}>
              <ListItemIcon>
                <InfoIcon/>
              </ListItemIcon>
              <ListItemText primary={t("AboutUs.AboutUs")}/>
            </ListItemButton>
          </ListItem>
          <Divider />
          <AuthenticationSidebarItem />
          <LanguageDropdown />
        </List>
      </Drawer>
    </Box>
  )
}