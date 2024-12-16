import {Alert, Box, Fade, Popper} from "@mui/material";
import Header from "./Header.tsx";
import { Outlet } from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import Sidebar from "./Sidebar/Sidebar.tsx";
import ScienceIcon from '@mui/icons-material/Science';
import {useTranslation} from "react-i18next";
const VERSION_NUMBER =import.meta.env.VITE_VERSION_NUMBER
const VERSION_TYPE =import.meta.env.VITE_VERSION_TYPE

export default function Layout() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [isDevelopmentMsgOpen, setIsDevelopmentMsgOpen] = useState(true);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [headerEl, setHeaderEl] = useState<HTMLElement | null>(null);

  const {t} = useTranslation();

  setTimeout(() => {
    setIsDevelopmentMsgOpen(false)
  }, 12000)

  useEffect(() => {
    // Update state when headerRef.current is ready
    setHeaderEl(headerRef.current);
  }, []);

  return (
    <Box sx={{ height: "100vh", display:'flex', flexDirection:'column'}}>
      <Header setOpenSidebar={setIsSideBarOpen} ref={headerRef} />
      <Sidebar openSidebar={isSideBarOpen} setOpenSidebar={setIsSideBarOpen} />

      {/* Render Popper once headerEl is available */}
      {headerEl && (
        <Popper
          open={isDevelopmentMsgOpen}
          anchorEl={headerEl}
          placement="bottom"
        >
          <Fade in={isDevelopmentMsgOpen}>
            <Alert
              severity="info"
              icon={<ScienceIcon />}
              onClose={() => setIsDevelopmentMsgOpen(false)}
            >
              {t('AboutUs.VersionMessage')+`${VERSION_TYPE} ${VERSION_NUMBER}`}
            </Alert>
          </Fade>
        </Popper>
      )}

      <Outlet />
    </Box>
  );
}