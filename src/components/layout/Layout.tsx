import { Box } from "@mui/material";
import Header from "./Header";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import UglyWelcome from './UglyWelcome.tsx'

export default function Layout() {
    const [openSidebar, setOpenSidebar] = useState(false);

    return (
        <Box sx={{height: "100vh"}}>
            <Header setOpenSidebar={setOpenSidebar}></Header>
            <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar}/>
            {location.pathname === '/' ? (
              <UglyWelcome />
            ) : (
              <Outlet />
            )}
        </Box>
    )
}