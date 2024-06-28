import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import { useState } from "react";
import { AccountCircle } from "@mui/icons-material";
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsMenu from "./SettingsMenu.tsx";
import {useNavigate} from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import {useTranslation} from "react-i18next";


export default function Header() {

    const [auth, setAuth] = useState(false); //Control authentication
    const navigate = useNavigate()
    const {t} = useTranslation();

    const handleClickUser = (auth: boolean) => {
        setAuth(auth);
    }

    return (
        <Box>
            <AppBar position="static">
                <Toolbar sx={{display: "flex", justifyContent: "right"}}>
                    <Box>
                      <Tooltip title={t('Sign in.Sign in')}>
                        <IconButton
                            size="large"
                            sx= {{color: "white"}}
                        >
                            {!auth ? (<AccountCircle onClick={() => { navigate('/signin') }}/>) : (<LogoutIcon onClick={() => handleClickUser(false)}/>)}
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Box>
                      <SettingsMenu />
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    )
}