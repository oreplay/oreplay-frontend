import { Suspense, useEffect, useState } from "react"
import { ThemeProvider, createTheme } from "@mui/material"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon"
import { LocalizationProvider } from "@mui/x-date-pickers"

import GeneralSuspenseFallback from "./components/GeneralSuspenseFallback.tsx"
import Layout from "./components/layout/Layout.tsx"
import { NotificationsProvider } from "@toolpad/core"
import { lazyWithRetry } from "./services/lazyLoad.ts"
import { useTranslation } from "react-i18next"
import { Settings as LuxonSettings } from "luxon"
import CountriesLocalizationProvider from "./services/countryService/countriesProvider.tsx"

const EventsList = lazyWithRetry(() => import("./pages/Results/pages/EventList/EventsList.tsx"))
const EventDetail = lazyWithRetry(() => import("./pages/Results/pages/EventDetail/EventDetail.tsx"))
const Dashboard = lazyWithRetry(
  () => import("./pages/Administration/pages/Dashboard/Dashboard.tsx"),
)
const CreateEvent = lazyWithRetry(
  () => import("./pages/Administration/pages/EventAdmin/pages/CreateEvent/CreateEvent.tsx"),
)
const InItSignIn = lazyWithRetry(
  () => import("./pages/Administration/pages/Authentication/pages/InItSignIn.tsx"),
)
const SignIn = lazyWithRetry(
  () => import("./pages/Administration/pages/Authentication/pages/SignIn.tsx"),
)
const SignUp = lazyWithRetry(
  () => import("./pages/Administration/pages/Authentication/pages/SignUp"),
)
const Authentication = lazyWithRetry(
  () => import("./pages/Administration/pages/Authentication/pages/Authentication.tsx"),
)
const PrivateRoute = lazyWithRetry(
  () => import("./pages/Administration/pages/Authentication/components/PrivateRoute.tsx"),
)
const EventAdmin = lazyWithRetry(
  () => import("./pages/Administration/pages/EventAdmin/pages/EventAdmin/EventAdmin.tsx"),
)
const Results = lazyWithRetry(() => import("./pages/Results/pages/Results/Results.tsx"))
const AboutUs = lazyWithRetry(() => import("./pages/AboutUs/AboutUs.tsx"))
const NotFoundPage = lazyWithRetry(() => import("./pages/NotFoundError/NotFoundPage.tsx"))
const Organizers = lazyWithRetry(() => import("./pages/Organizers/organizers.tsx"))
const PrivacyPolicy = lazyWithRetry(() => import("./pages/PrivacyPolicy/PrivacyPolicy.tsx"))
const CookiesPolicy = lazyWithRetry(() => import("./pages/CookiesPolicy/CookiesPolicy.tsx"))
const LegalNotice = lazyWithRetry(() => import("./pages/LegalNotice/LegalNotice.tsx"))
const MyAccount = lazyWithRetry(() => import("./pages/Administration/pages/MyAccount/index.tsx"))

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
  const { i18n } = useTranslation()

  // Update luxon and MUI locales locale
  const [lng, setLng] = useState<string>(i18n.language)
  useEffect(() => {
    LuxonSettings.defaultLocale = i18n.language
    // Within a useEffect to avoid listeners accumulation
    const handler = (newLanguage: string) => {
      console.debug("Language changed: ", newLanguage.trim())
      LuxonSettings.defaultLocale = newLanguage
      setLng(newLanguage)
    }
    i18n.on("languageChanged", handler)
    return () => {
      i18n.off("languageChanged", handler)
    }
  }, [i18n])

  // Component
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={lng}>
        <NotificationsProvider
          slotProps={{
            snackbar: {
              anchorOrigin: { vertical: "top", horizontal: "center" },
            },
          }}
        >
          <CountriesLocalizationProvider>
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
                  <Route path={"/sign-up"} element={<SignUp />} />
                </Routes>
              </BrowserRouter>
            </Suspense>
          </CountriesLocalizationProvider>
        </NotificationsProvider>
      </LocalizationProvider>
    </ThemeProvider>
  )
}
