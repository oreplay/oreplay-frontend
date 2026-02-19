import { Box, Container, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import EventsDataGrid from "./components/EventsDataGrid"

export default function Dashboard() {
  const { t } = useTranslation()

  return (
    <Box sx={{ minHeight: "100vh", flexGrow: 1, backgroundColor: "#f6f6f6", py: 6 }}>
      <Container maxWidth={"md"}>
        <Typography component="h1" variant="h5" fontWeight={600} gutterBottom>
          {t("Dashboard.YourEvents.title")}
        </Typography>
        <Typography component={"p"} variant={"body2"} color="text.secondary" sx={{ mb: 4 }}>
          {t("Dashboard.YourEvents.description")}
        </Typography>
        <EventsDataGrid />
      </Container>
    </Box>
  )
}
