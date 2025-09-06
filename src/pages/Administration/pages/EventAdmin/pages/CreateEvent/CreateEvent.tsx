import EventAdminForm from "../../components/EventAdminForm"
import React from "react"
import { postEvent } from "../../../../services/EventAdminService.ts"
import { DateTime } from "luxon"
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
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void createEvent(event)
  }

  const createEvent = async (event: React.FormEvent<HTMLFormElement>) => {
    const data = new FormData(event.currentTarget)
    console.log(data)
    try {
      const response = await postEvent(
        data.get("description") as string,
        DateTime.fromFormat(data.get("startDate") as string, "dd/MM/yyyy").toSQLDate() as string,
        DateTime.fromFormat(data.get("endDate") as string, "dd/MM/yyyy").toSQLDate() as string,
        data.get("scope") as string,
        !!data.get("isPublic"),
        token,
        data.get("website") ? (data.get("website") as string) : undefined,
        undefined,
        data.get("organizerId") as string,
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
