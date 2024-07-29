import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import SettingsMenu from "./SettingsMenu.tsx";
import {useNavigate} from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import {useTranslation} from "react-i18next";
import {useAuth} from "../../shared/hooks.ts";
import {AccountCircle, ArrowBack} from "@mui/icons-material";


export default function Header() {

  const {user} = useAuth(); //Control authentication
  const navigate = useNavigate()
  const {t} = useTranslation();


  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{display: "flex", justifyContent: "space-between"}}>
          <Box>
            <Tooltip title={t('GoBack')}>
              <ArrowBack sx={{color:"white"}}/>
            </Tooltip>
          </Box>
          <Box display={"flex"} sx= {{justifyContent: "right"}}>
            <Box>
              <Tooltip title={t('Sign in.Sign in')}>
                <IconButton
                  size="large"
                  sx= {{color: "white"}}
                  onClick={() => { navigate('/signin') }}
                >
                  {!user ? (<LoginIcon />) : <AccountCircle />}
                </IconButton>
              </Tooltip>
            </Box>
            <Box>
              <SettingsMenu />
            </Box>
          </Box>

        </Toolbar>
      </AppBar>
    </Box>
  )
}