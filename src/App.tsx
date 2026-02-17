import { lazy, Suspense } from "react"
import { ThemeProvider, createTheme } from "@mui/material"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon"
import { LocalizationProvider } from "@mui/x-date-pickers"

import GeneralSuspenseFallback from "./components/GeneralSuspenseFallback.tsx"
import Layout from "./components/layout/Layout.tsx"
import { NotificationsProvider } from "@toolpad/core"

const EventsList = lazy(() => import("./pages/Results/pages/EventList/EventsList.tsx"))
const EventDetail = lazy(() => import("./pages/Results/pages/EventDetail/EventDetail.tsx"))
const Dashboard = lazy(() => import("./pages/Administration/pages/Dashboard/Dashboard.tsx"))
const CreateEvent = lazy(
  () => import("./pages/Administration/pages/EventAdmin/pages/CreateEvent/CreateEvent.tsx"),
)
const InItSignIn = lazy(
  () => import("./pages/Administration/pages/Authentication/pages/InItSignIn.tsx"),
)
const SignIn = lazy(() => import("./pages/Administration/pages/Authentication/pages/SignIn.tsx"))
const Authentication = lazy(
  () => import("./pages/Administration/pages/Authentication/pages/Authentication.tsx"),
)
const PrivateRoute = lazy(
  () => import("./pages/Administration/pages/Authentication/components/PrivateRoute.tsx"),
)
const EventAdmin = lazy(
  () => import("./pages/Administration/pages/EventAdmin/pages/EventAdmin/EventAdmin.tsx"),
)
const Results = lazy(() => import("./pages/Results/pages/Results/Results.tsx"))
const AboutUs = lazy(() => import("./pages/AboutUs/AboutUs.tsx"))
const NotFoundPage = lazy(() => import("./pages/NotFoundError/NotFoundPage.tsx"))
const Organizers = lazy(() => import("./pages/Organizers/organizers.tsx"))
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy/PrivacyPolicy.tsx"))
const CookiesPolicy = lazy(() => import("./pages/CookiesPolicy/CookiesPolicy.tsx"))
const LegalNotice = lazy(() => import("./pages/LegalNotice/LegalNotice.tsx"))
const MyAccount = lazy(() => import("./pages/Administration/pages/MyAccount/index.tsx"))

// Customize style of app
const theme = createTheme({
  palette: {
    primary: {
      main: "#ff710a",
      light: "#f5f5f5",
    },
    text: {
      secondary: "#646464",
    },
    secondary: {
      main: "#5e2572",
      light: "#efefef",
    },
  },
})

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={"es-ES"}>
        {/** TODO: manage real location**/}
        <NotificationsProvider
          slotProps={{
            snackbar: {
              anchorOrigin: { vertical: "top", horizontal: "center" },
            },
          }}
        >
          <Suspense fallback={<GeneralSuspenseFallback useViewPort />}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<EventsList />} />
                  <Route path="competitions" element={<Navigate to={"/"} />} />
                  <Route path="About-us" element={<AboutUs />} />
                  <Route path="organizers" element={<Organizers />} />
                  <Route path="privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="cookies-policy" element={<CookiesPolicy />} />
                  <Route path="legal-notice" element={<LegalNotice />} />
                  <Route path="competitions/:id" element={<EventDetail />} />
                  <Route path="competitions/:eventId/:stageId" element={<Results />} />
                  <Route element={<PrivateRoute />}>
                    <Route path={"/dashboard"} element={<Dashboard />} />
                    <Route path={"/admin/create-event"} element={<CreateEvent />} />
                    <Route path={"/admin/:eventId"} element={<EventAdmin />} />
                    <Route path={"/my-account"} element={<MyAccount />} />
                  </Route>
                  <Route path={"/*"} element={<NotFoundPage />} />
                </Route>
                <Route path={"/signin"}>
                  <Route index element={<InItSignIn />} />
                  <Route path={"form"} element={<SignIn />} />
                  <Route path={"auth"} element={<Authentication />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </Suspense>
        </NotificationsProvider>
      </LocalizationProvider>
    </ThemeProvider>
  )
}
