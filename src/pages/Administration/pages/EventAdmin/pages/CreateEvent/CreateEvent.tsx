import EventAdminForm, { EventAdminFormValues } from "../../components/EventAdminForm"
import { postEvent } from "../../../../services/EventAdminService.ts"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../../../../shared/hooks.ts"
import { Container } from "@mui/material"
import { apiErrorService } from "../../../../../../domain/services/ApiErrorService.ts"
import { useNotifications } from "@toolpad/core/useNotifications"

export default function CreateEvent() {
  const { token } = useAuth() as { token: string }
  const navigate = useNavigate()
  const notifications = useNotifications()

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
    <Container>
      <EventAdminForm canEdit handleSubmit={handleSubmit} handleCancel={handleCancel} />
    </Container>
  )
}
