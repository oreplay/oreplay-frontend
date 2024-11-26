import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import DehazeIcon from '@mui/icons-material/Dehaze';
import {useLocation, useNavigate} from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import {useTranslation} from "react-i18next";
import {useAuth} from "../../shared/hooks.ts";
import {AccountCircle, ArrowBack} from "@mui/icons-material";
import React from "react";

type Props = {
  setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>
  ref: React.MutableRefObject<HTMLDivElement>
}

const Header = React.forwardRef((props:Props, ref) => {

  const {user} = useAuth(); //Control authentication
  const navigate = useNavigate()
  const location = useLocation();
  const {t} = useTranslation();


  return (
    <Box ref={ref}>
      <AppBar sx={{backgroundColor:'white'}} elevation={0} position="static">
        <Toolbar sx={{display: "flex", justifyContent: "space-between"}}>
          <Box>
            { location?.key !== "default" && <Tooltip title={t('GoBack')}>
              <IconButton
                size="large"
                sx={{color: "text.secondary"}}
                onClick={() => { navigate(-1) }}
              >
                <ArrowBack sx={{color: "text.secondary"}}/>
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
                      sx= {{color: "text.secondary"}}
                      onClick={() => navigate('/signin')}
                    >
                      <LoginIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title={t('Dashboard.YourEvents')}>
                    <IconButton
                      size="large"
                      sx= {{color: "text.secondary"}}
                      onClick={() => { navigate('/dashboard') }}
                    >
                      <AccountCircle />
                    </IconButton>
                  </Tooltip>
                )
              }
            </Box>
            <Box>
              <Tooltip title={t('Menu')}>
                <IconButton
                  size="large"
                  sx= {{color: "text.secondary"}}
                  onClick={() => props.setOpenSidebar(prev => !prev)}
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
})

export default Header