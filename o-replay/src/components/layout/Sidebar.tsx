import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Theme, useTheme } from "@mui/material";
import EventIcon from '@mui/icons-material/Event';
import { useNavigate } from "react-router-dom";

type Props = {
    openSidebar: boolean,
    setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>
}
export default function Sidebar({openSidebar, setOpenSidebar}: Props) {
    const theme: Theme = useTheme();
    const navigate = useNavigate();
    
    return (
        <Box>
            <Drawer
                ModalProps={{
                    BackdropProps: {
                        invisible: true,
                    }
                }}
                anchor="left"
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
                            <ListItemText sx= {{color: "white"}} primary={"Eventos"}/>
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </Box>
    )
}