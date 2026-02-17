import { Box } from "@mui/material"
import Header from "./Header.tsx"
import { Outlet } from "react-router-dom"
import { Suspense, useEffect, useState } from "react"
import Sidebar from "./Sidebar/Sidebar.tsx"
import { useTranslation } from "react-i18next"
import GeneralSuspenseFallback from "../GeneralSuspenseFallback.tsx"
import { ErrorBoundary } from "@sentry/react"
import GeneralErrorFallback from "../GeneralErrorFallback.tsx"
import { useNotifications } from "@toolpad/core/useNotifications"
const VERSION_NUMBER = import.meta.env.VITE_VERSION_NUMBER
const VERSION_TYPE = import.meta.env.VITE_VERSION_TYPE

export default function Layout() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)
  const { t } = useTranslation()

  const notifications = useNotifications()

  useEffect(() => {
    notifications.show(t("AboutUs.VersionMessage") + `${VERSION_TYPE} ${VERSION_NUMBER}`, {
      key: "versionNumber Msg",
      autoHideDuration: 5000,
      severity: "info",
    })
  }, [notifications, t])

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header key={"AppHeader"} setOpenSidebar={setIsSideBarOpen} />
      <Sidebar key={"AppSidebar"} openSidebar={isSideBarOpen} setOpenSidebar={setIsSideBarOpen} />

      <Suspense fallback={<GeneralSuspenseFallback />} key={location.pathname}>
        <ErrorBoundary key={"MainErrorBoundary"} fallback={<GeneralErrorFallback displayMsg />}>
          <Outlet />
        </ErrorBoundary>
      </Suspense>
    </Box>
  )
}
