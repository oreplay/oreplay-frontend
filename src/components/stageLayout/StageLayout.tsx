import { Box, Typography } from "@mui/material";
import StageHeader from "./StageHeader";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function StageLayout()
{
    const [eventName, setEventName] = useState<string>();
    const [stageName, setStageName] = useState<string>();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.eventName !== undefined)
            setEventName(location.state.eventName);
        if (location.state?.stageName !== undefined)
            setStageName(location.state.stageName);
    }, []);

    return <Box sx={{height:"100%", width: "100%", display: "flex", flexDirection: "column"}}>        
        <Typography sx={{paddingTop: "46px", paddingLeft: "46px"}}>{eventName} - {stageName}</Typography>
        <Outlet/>
        <StageHeader/>
    </Box>
}