import { ThemeProvider, createTheme } from '@mui/material'
import Layout from './components/layout/Layout'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import EventsList from './components/events/EventsList'
import EventDetail from './components/events/EventDetail'

export default function App() {

  // Customize style of app
  const theme = createTheme({
    palette: {
      primary: {
        main: "#E78228",
        light: "#FAD4B2"
      },
      secondary: {
        main: "#B85E0F"
      }
    },
    
  })

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout/>}>
            <Route path='competitions' element={<EventsList/>}/>
            <Route path='detail/:event' element={<EventDetail/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
    
  )
}