import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import DehazeIcon from '@mui/icons-material/Dehaze';
import SettingsMenu from "./SettingsMenu.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import {useTranslation} from "react-i18next";
import {useAuth} from "../../shared/hooks.ts";
import {AccountCircle, ArrowBack} from "@mui/icons-material";

type Props = {
  setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Header({setOpenSidebar}: Props) {

  const {user} = useAuth(); //Control authentication
  const navigate = useNavigate()
  const location = useLocation();
  const {t} = useTranslation();


  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{display: "flex", justifyContent: "space-between"}}>
          <Box>
            { location?.key !== "default" && <Tooltip title={t('GoBack')}>
              <IconButton
                size="large"
                sx={{color: "white"}}
                onClick={() => { navigate(-1) }}
              >
                <ArrowBack sx={{color: "white"}}/>
              </IconButton>
            </Tooltip>}
          </Box>
          <Box display={"flex"} sx= {{justifyContent: "right"}}>
            <Box>
              {
                !user ? (
                  <Tooltip title={t('Sign in.Sign in')}>
                    <IconButton
                      size="large"
                      sx= {{color: "white"}}
                      onClick={() => navigate('/signin')}
                    >
                      <LoginIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title={t('Dashboard.YourEvents')}>
                    <IconButton
                      size="large"
                      sx= {{color: "white"}}
                      onClick={() => { navigate('/dashboard') }}
                    >
                      <AccountCircle />
                    </IconButton>
                  </Tooltip>
                )
              }
            </Box>
            <Box>
              <SettingsMenu />
            </Box>
            <Box>
              <Tooltip title={t('Menu')}>
                <IconButton
                  size="large"
                  sx= {{color: "white"}}
                  onClick={() => setOpenSidebar(prev => !prev)}
                >
                  <DehazeIcon/>
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}