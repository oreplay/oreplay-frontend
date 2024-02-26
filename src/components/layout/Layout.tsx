import { Box } from "@mui/material";
import Header from "./Header";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    const [openSidebar, setOpenSidebar] = useState(false);

    console.log(openSidebar);
    return (
        <Box sx={{height: "100vh"}}>
            <Header setOpenSidebar={setOpenSidebar}></Header>
            <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar}/>
            <Outlet/>
        </Box>
    )
}