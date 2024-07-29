import { Box } from "@mui/material";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function Layout() {

  return (
    <Box sx={{height: "100vh"}}>
      <Header />
      <Outlet />
    </Box>
  )
}