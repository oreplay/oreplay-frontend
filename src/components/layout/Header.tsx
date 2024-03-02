import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";
import { AccountCircle } from "@mui/icons-material";
import LogoutIcon from '@mui/icons-material/Logout';

type Props = {
    setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Header({setOpenSidebar}: Props) {

    const [auth, setAuth] = useState(false); //Control authentication

    const handleClickUser = (auth: boolean) => {
        setAuth(auth);
    }

    return (
        <Box>
            <AppBar position="static">
                <Toolbar sx={{display: "flex", justifyContent: "space-between"}}>
                    <IconButton size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2, color: "white" }}
                        onClick={() => setOpenSidebar(prev => !prev)}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Box>
                        <IconButton
                            size="large"
                            sx= {{color: "white"}}
                        >
                            {!auth ? (<AccountCircle onClick={() => handleClickUser(true)}/>) : (<LogoutIcon onClick={() => handleClickUser(false)}/>)}
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    )
}