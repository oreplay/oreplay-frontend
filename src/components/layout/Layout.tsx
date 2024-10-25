import { Box } from "@mui/material";
import Header from "./Header.tsx";
import { Outlet } from "react-router-dom";

export default function Layout() {

  return (
    <Box sx={{height: "100vh"}}>
      <Box sx={{height:"100%", display:"flex", flexDirection:"column"}}>
        <Header />
        <Outlet />
      </Box>
    </Box>
  )
}