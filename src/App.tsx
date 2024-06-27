import { ThemeProvider, createTheme } from '@mui/material'
import Layout from './components/layout/Layout'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import EventsList from './components/events/EventsList'
import EventDetail from './components/events/EventDetail'
import Login from "./components/users/login.tsx";

export default function App() {

  // Customize style of app
  const theme = createTheme({
    palette: {
      primary: {
        main: "#E78228",
        light: "#FAD4B2"
      },
      secondary: {
        main: "#6702a8"
      }
    },

  })

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout/>}>
            <Route path='competitions' element={<EventsList/>}/>
            <Route path='competitions/:id' element={<EventDetail/>}/>
          </Route>
          <Route path={'/login'} element={<Login/>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>

  )
}