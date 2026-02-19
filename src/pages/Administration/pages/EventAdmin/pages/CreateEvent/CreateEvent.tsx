import EventAdminForm, { EventAdminFormValues } from "../../components/EventAdminForm"
import { postEvent } from "../../../../services/EventAdminService.ts"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../../../../shared/hooks.ts"
import { Box, Container, Typography } from "@mui/material"
import { apiErrorService } from "../../../../../../domain/services/ApiErrorService.ts"
import { useNotifications } from "@toolpad/core/useNotifications"
import { useTranslation } from "react-i18next"

export default function CreateEvent() {
  const { token } = useAuth() as { token: string }
  const navigate = useNavigate()
  const notifications = useNotifications()
  const { t } = useTranslation()

  const handleCancel = () => void navigate("/dashboard")
  const handleSubmit = (event: EventAdminFormValues) => {
    void createEvent(event)
  }

  const createEvent = async (event: EventAdminFormValues) => {
    try {
      const response = await postEvent(
        event.description,
        event.startDate?.toSQLDate() as string,
        event.endDate?.toSQLDate() as string,
        event.scope,
        event.isPublic,
        token,
        event.website,
        undefined,
        event.organizer?.id,
      )
      await navigate(`/admin/${response.data.id}`)
    } catch (e) {
      notifications.show("Edit event failed. " + apiErrorService.toString(e), {
        autoHideDuration: 3000,
        severity: "error", // Could be 'success', 'error', 'warning', 'info'.
      })
    }
  }

  return (
    <Box sx={{ height: "100%", backgroundColor: "#f6f6f6", py: 6 }}>
      <Container maxWidth="md">
        <Typography component="h1" variant="h5" fontWeight={600} gutterBottom>
          {t("Dashboard.YourEvents.CreateEvent")}
        </Typography>
        <EventAdminForm
          canEdit
          displayPlaceholders
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
        />
      </Container>
    </Box>
  )
}
