import { ThemeProvider, createTheme } from '@mui/material'
import Layout from './components/layout/Layout'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import EventsList from './components/events/EventsList'
import EventDetail from './components/events/EventDetail'
import Home from "./components/Home/Home.tsx";
import {AuthProvider} from "./shared/AuthProvider.tsx";
import PrivateRoute from "./components/users/PrivateRoute.tsx";
import {Dashboard} from "./components/administration/Dashboard.tsx";
import EventAdmin from "./components/administration/EventAdmin.tsx";
import {AdapterLuxon} from "@mui/x-date-pickers/AdapterLuxon";
import {LocalizationProvider} from "@mui/x-date-pickers";
import CreateEvent from "./components/administration/CreateEvent.tsx";
import Authentication from "./components/users/Authentication.tsx";
import InItSignIn from "./components/users/InItSignIn.tsx";
import SignIn from "./components/users/SignIn.tsx";
import StageLayout from './components/stageLayout/StageLayout.tsx'
import StartTimesStage from './components/stageDetail/StartTimesStage.tsx'
import ResultsStage from './components/stageDetail/ResultsStage.tsx'
import SplitsStage from './components/stageDetail/SplitsStage.tsx'

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
                <Route path='competitions/:eventId/:stageId' element={<StageLayout/>}>
                  <Route path='startList' element={<StartTimesStage/>}/>
                  <Route path='results' element={<ResultsStage/>}/>
                  <Route path='splits' element={<SplitsStage/>}/>
                </Route>
                <Route  element={<PrivateRoute />}>
                  <Route path={'/dashboard'} element={<Dashboard />} />
                  <Route path={'/admin/create-event'} element={<CreateEvent />} />
                  <Route path={'/admin/:eventId'} element={<EventAdmin />} />
                </Route>
              </Route>
              <Route path={'/signin'} >
                <Route index element={<InItSignIn/>} />
                <Route path={'form'} element={<SignIn/>} />
                <Route path={'auth'} element={<Authentication />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  )
}