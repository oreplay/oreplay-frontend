import { ThemeProvider, createTheme } from '@mui/material'
import Layout from './components/layout/Layout'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import EventsList from './components/events/EventsList'
import EventDetail from './components/events/EventDetail'
import SignIn from "./components/users/SignIn.tsx";
import FootOResults from "./components/events/EventRunners/FootOResults/FootOResults.tsx";
import Home from "./components/Home/Home.tsx";
import EventRunnersLayout from "./components/events/EventRunners/Layout/EventRunnersLayout.tsx";
import StartList from "./components/events/EventRunners/StartList.tsx";
import Splits from "./components/events/EventRunners/Splits.tsx";
import {AuthProvider} from "./shared/AuthProvider.tsx";
import PrivateRoute from "./components/users/PrivateRoute.tsx";
import {Dashboard} from "./components/administration/Dashboard.tsx";
import EventAdmin from "./components/administration/EventAdmin.tsx";
import {AdapterLuxon} from "@mui/x-date-pickers/AdapterLuxon";
import {LocalizationProvider} from "@mui/x-date-pickers";
import CreateEvent from "./components/administration/CreateEvent.tsx";

export default function App() {

  // Customize style of app
  const theme = createTheme({
    palette: {
      primary: {
        main: "#ff710a",
        light: "#f5f5f5"
      },
      text: {
        secondary: "#646464"
      },
      secondary: {
        main: "#5e2572",
        light: "#efefef"
      }
    },

  })

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={'es-ES'}> {/** TODO: manage real location**/}
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Layout/>} >
                <Route index element={<Home />} />
                <Route path='competitions' element={<EventsList/>} />
                <Route path='competitions/:id' element={<EventDetail/>} />
                <Route path='competitions/:eventId/:stageId' element={<EventRunnersLayout/>}>
                  <Route path={'start-list'} element={<StartList/>} />
                  <Route path={'results'} element={<FootOResults/>} />
                  <Route path={'splits'} element={<Splits />} />
                </Route>
                <Route  element={<PrivateRoute />}>
                  <Route path={'/dashboard'} element={<Dashboard />} />
                  <Route path={'/admin/create-event'} element={<CreateEvent />} />
                  <Route path={'/admin/:eventId'} element={<EventAdmin />} />
                </Route>
              </Route>
              <Route path={'/signin'} element={<SignIn/>} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  )
}