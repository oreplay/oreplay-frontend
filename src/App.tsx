import { ThemeProvider, createTheme } from "@mui/material";
import Layout from "./components/layout/Layout.tsx";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import EventsList from "./pages/Results/pages/EventList/EventsList.tsx";
import EventDetail from "./pages/Results/pages/EventDetail/EventDetail.tsx";
import { Dashboard } from "./pages/Administration/pages/Dashboard/Dashboard.tsx";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers";
import CreateEvent from "./pages/Administration/pages/EventAdmin/pages/CreateEvent/CreateEvent.tsx";
import InItSignIn from "./pages/Administration/pages/Authentication/pages/InItSignIn.tsx";
import SignIn from "./pages/Administration/pages/Authentication/pages/SignIn.tsx";
import Authentication from "./pages/Administration/pages/Authentication/pages/Authentication.tsx";
import PrivateRoute from "./pages/Administration/pages/Authentication/components/PrivateRoute.tsx";
import EventAdmin from "./pages/Administration/pages/EventAdmin/pages/EventAdmin/EventAdmin.tsx";
import StageLayout from "./pages/Results/pages/Layout/StageLayout.tsx";
import AboutUs from "./pages/AboutUs/AboutUs.tsx";
import NotFoundPage from "./pages/NotFoundError/NotFoundPage.tsx";
import Organizers from "./pages/Organizers/organizers.tsx";
import { Suspense } from "react";

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
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={"es-ES"}>
        {" "}
        {/** TODO: manage real location**/}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<EventsList />} />
              <Route path="competitions" element={<Navigate to={"/"} />} />
              <Route path="About-us" element={<AboutUs />} />
              <Route
                path="organizers"
                element={
                  <Suspense>
                    <Organizers />
                  </Suspense>
                }
              />
              <Route path="competitions/:id" element={<EventDetail />} />
              <Route path="competitions/:eventId/:stageId" element={<StageLayout />} />
              <Route element={<PrivateRoute />}>
                <Route path={"/dashboard"} element={<Dashboard />} />
                <Route path={"/admin/create-event"} element={<CreateEvent />} />
                <Route path={"/admin/:eventId"} element={<EventAdmin />} />
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
      </LocalizationProvider>
    </ThemeProvider>
  );
}
