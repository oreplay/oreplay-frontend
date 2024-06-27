import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import { useState } from "react";
import { AccountCircle } from "@mui/icons-material";
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsMenu from "./SettingsMenu.tsx";


export default function Header() {

    const [auth, setAuth] = useState(false); //Control authentication

    const handleClickUser = (auth: boolean) => {
        setAuth(auth);
    }

    return (
        <Box>
            <AppBar position="static">
                <Toolbar sx={{display: "flex", justifyContent: "right"}}>
                    <Box>
                        <IconButton
                            size="large"
                            sx= {{color: "white"}}
                        >
                            {!auth ? (<AccountCircle onClick={() => handleClickUser(true)}/>) : (<LogoutIcon onClick={() => handleClickUser(false)}/>)}
                        </IconButton>
                    </Box>
                    <Box>
                      <SettingsMenu />
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    )
}