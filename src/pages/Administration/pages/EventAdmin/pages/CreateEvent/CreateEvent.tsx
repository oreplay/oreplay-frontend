import EventAdminForm from "../../components/EventAdminForm.tsx"
import React from "react"
import { postEvent } from "../../../../services/EventAdminService.ts"
import { DateTime } from "luxon"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../../../../shared/hooks.ts"
import { Container } from "@mui/material"

export default function CreateEvent() {
  const { token } = useAuth() as { token: string }
  const navigate = useNavigate()

  const handleCancel = () => void navigate("/dashboard")

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const response = postEvent(
      data.get("description") as string,
      DateTime.fromFormat(data.get("startDate") as string, "dd/MM/yyyy").toSQLDate() as string,
      DateTime.fromFormat(data.get("endDate") as string, "dd/MM/yyyy").toSQLDate() as string,
      data.get("scope") as string,
      !!data.get("isPublic"),
      token,
      data.get("website") ? (data.get("website") as string) : undefined,
      undefined,
      data.get("organizer") as string,
    )
    response.then(
      (response) => {
        void navigate(`/admin/${response.data.id}`)
      },
      () => console.log("Create event failed", response),
    )
  }

  return (
    <Container>
      <EventAdminForm canEdit handleSubmit={handleSubmit} handleCancel={handleCancel} />
    </Container>
  )
}
