import { Box } from "@mui/material";
import Header from "./Header.tsx";
import { Outlet } from "react-router-dom";
import {useState} from "react";
import Sidebar from "./Sidebar.tsx";

export default function Layout() {
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false);

  return (
    <Box sx={{height: "100vh"}}>
      <Box sx={{height:"100%", display:"flex", flexDirection:"column"}}>
        <Header setOpenSidebar={setIsSideBarOpen}/>
        <Sidebar openSidebar={isSideBarOpen} setOpenSidebar={setIsSideBarOpen}/>
        <Outlet />
      </Box>
    </Box>
  )
}