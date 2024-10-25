import { ThemeProvider, createTheme } from '@mui/material'
import Layout from './components/layout/Layout.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import EventsList from './pages/Results/pages/EventList/EventsList.tsx'
import EventDetail from './pages/Results/pages/EventDetail/EventDetail.tsx'
import Home from "./pages/Home/Home.tsx";
import {AuthProvider} from "./shared/AuthProvider.tsx";
import {Dashboard} from "./pages/Administration/pages/Dashboard/Dashboard.tsx";
import {AdapterLuxon} from "@mui/x-date-pickers/AdapterLuxon";
import {LocalizationProvider} from "@mui/x-date-pickers";
import StageLayout from "./pages/Results/components/StageLayout.tsx";
import StartTimesStage from "./pages/Results/pages/FootO/pages/StartTime/StartTimesStage.tsx";
import ResultsStage from "./pages/Results/pages/FootO/pages/Results/ResultsStage.tsx";
import SplitsStage from "./pages/Results/pages/FootO/pages/Splits/SplitsStage.tsx";
import CreateEvent from "./pages/Administration/pages/EventAdmin/pages/CreateEvent/CreateEvent.tsx";
import InItSignIn from "./pages/Administration/pages/Authentication/pages/InItSignIn.tsx";
import SignIn from "./pages/Administration/pages/Authentication/pages/SignIn.tsx";
import Authentication from "./pages/Administration/pages/Authentication/pages/Authentication.tsx";
import PrivateRoute from "./pages/Administration/pages/Authentication/components/PrivateRoute.tsx";
import EventAdmin from "./pages/Administration/pages/EventAdmin/pages/EventAdmin/EventAdmin.tsx";

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