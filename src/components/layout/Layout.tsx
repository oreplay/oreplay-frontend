import { Box } from "@mui/material";
import Header from "./Header";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import UglyWelcome from './UglyWelcome.tsx'

export default function Layout() {

    return (
        <Box sx={{height: "100vh"}}>
            <Header></Header>
            {location.pathname === '/' ? (
              <UglyWelcome />
            ) : (
              <Outlet />
            )}
        </Box>
    )
}