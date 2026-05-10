import { Box } from "@mui/material"
import Header from "./Header.tsx"
import { Outlet } from "react-router-dom"
import { Suspense, useState } from "react"
import Sidebar from "./Sidebar/Sidebar.tsx"
import GeneralSuspenseFallback from "../GeneralSuspenseFallback.tsx"
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary.tsx"

export default function Layout() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header key={"AppHeader"} setOpenSidebar={setIsSideBarOpen} />
      <Sidebar key={"AppSidebar"} openSidebar={isSideBarOpen} setOpenSidebar={setIsSideBarOpen} />

      <Suspense fallback={<GeneralSuspenseFallback />} key={location.pathname}>
        <ErrorBoundary key={"MainErrorBoundary"} displayMsg>
          <Outlet />
        </ErrorBoundary>
      </Suspense>
    </Box>
  )
}
