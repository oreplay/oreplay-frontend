import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Link,
} from "@mui/material"
import EventIcon from "@mui/icons-material/Event"
import InfoIcon from "@mui/icons-material/Info"
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import CloseIcon from "@mui/icons-material/Close"
import DashboardIcon from "@mui/icons-material/Dashboard"
import React from "react"
import LanguageDropdown from "./components/LanguageDropdown.tsx"
import AuthenticationSidebarItem from "./components/AuthenticationSidebarItem.tsx"
import { useAuth } from "../../../shared/hooks.ts"
import { useQuery } from "react-query"
import { getBackendVersion } from "../../../services/VersionService.ts"

type Props = {
  openSidebar: boolean
  setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>
}
export default function Sidebar({ openSidebar, setOpenSidebar }: Props) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user } = useAuth()

  // Get frontend version from package.json
  const frontendVersion = import.meta.env.VITE_VERSION_NUMBER || "0.2.29"

  // Fetch backend version with proper stale time
  const { data: backendVersion } = useQuery("backend-version", getBackendVersion, {
    staleTime: Infinity,
    retry: false,
  })

  return (
    <Box>
      <Drawer
        ModalProps={{
          BackdropProps: {
            invisible: true,
          },
        }}
        anchor="right"
        open={openSidebar}
        onClose={() => setOpenSidebar((prev) => !prev)}
        sx={{
          "&.MuiDrawer-root .MuiDrawer-paper": {
            background: "white",
          },
        }}
      >
        {/* Top bar with language selector and close button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1,
            minHeight: "56px", // Consistent height for top bar
          }}
        >
          {/* Left side: Language selector with icon and text */}
          <LanguageDropdown />

          {/* Right side: Close button */}
          <IconButton onClick={() => setOpenSidebar((prev) => !prev)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          <ListItem>
            <ListItemButton
              onClick={() => {
                void navigate("/competitions")
                setOpenSidebar((prev) => !prev)
              }}
            >
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <ListItemText primary={t("Events")} />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              onClick={() => {
                void navigate("/About-us")
                setOpenSidebar((prev) => !prev)
              }}
            >
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText primary={t("AboutUs.AboutUs")} />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              onClick={() => {
                void navigate("organizers")
                setOpenSidebar((prev) => !prev)
              }}
            >
              <ListItemIcon>
                <SupervisedUserCircleIcon />
              </ListItemIcon>
              <ListItemText primary={t("Organizers")} />
            </ListItemButton>
          </ListItem>
          <Divider />
          {user && (
            <ListItem>
              <ListItemButton
                onClick={() => {
                  void navigate("/dashboard")
                  setOpenSidebar((prev) => !prev)
                }}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary={t("Dashboard.Dashboard")} />
              </ListItemButton>
            </ListItem>
          )}
          <AuthenticationSidebarItem />
        </List>

        {/* Legal Links and Version Info */}
        <Box sx={{ mt: "auto", p: 2 }}>
          {/* Legal Links */}
          <Box sx={{ mb: 2 }}>
            <Link
              key={"LegalNote"}
              component="button"
              variant="body2"
              sx={{
                display: "block",
                mb: 0.5,
                fontSize: "0.75rem",
                color: "text.secondary",
                textDecoration: "none",
                textAlign: "left",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
              onClick={() => {
                void navigate("/legal-notice")
                setOpenSidebar(false)
              }}
            >
              {t("sidebar.legalNotice")}
            </Link>
            <Link
              key={"Privacy policy"}
              component="button"
              variant="body2"
              sx={{
                display: "block",
                mb: 0.5,
                fontSize: "0.75rem",
                color: "text.secondary",
                textDecoration: "none",
                textAlign: "left",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
              onClick={() => {
                void navigate("/privacy-policy")
                setOpenSidebar(false)
              }}
            >
              {t("sidebar.privacyPolicy")}
            </Link>
            <Link
              component="button"
              variant="body2"
              sx={{
                display: "block",
                mb: 0.5,
                fontSize: "0.75rem",
                color: "text.secondary",
                textDecoration: "none",
                textAlign: "left",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
              onClick={() => {
                void navigate("/cookies-policy")
                setOpenSidebar(false)
              }}
            >
              {t("sidebar.cookiePolicy")}
            </Link>
          </Box>

          {/* Version Information in one line */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.7rem",
              color: "text.secondary",
              opacity: 0.7,
            }}
          >
            <Typography key={"frontEndVersion"} variant="caption">
              {t("sidebar.frontendVersionWithVersion", { version: frontendVersion })}
            </Typography>
            {backendVersion && (
              <Typography variant="caption" sx={{ ml: 1 }}>
                {`${t("sidebar.backendVersion")} v${backendVersion}`}
              </Typography>
            )}
          </Box>
        </Box>
      </Drawer>
    </Box>
  )
}
