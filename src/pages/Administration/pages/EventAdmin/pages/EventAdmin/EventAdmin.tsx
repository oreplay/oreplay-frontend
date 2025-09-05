import EventAdminForm from "../../components/EventAdminForm"
import { Alert, AlertTitle, Box, Container, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import StagesDataGrid from "./components/StagesDataGrid.tsx"
import EventTokenDataGrid from "./components/EventTokenDataGrid.tsx"
import DeleteEventButton from "./components/DeleteEventButton.tsx"
import QRCodeSection from "../../../../../../components/QRCodeSection.tsx"
import React, { useState } from "react"
import { patchEvent } from "../../../../services/EventAdminService.ts"
import { DateTime } from "luxon"
import { EventDetailModel, useRequiredParams } from "../../../../../../shared/EntityTypes.ts"
import { useAuth } from "../../../../../../shared/hooks.ts"
import GeneralSuspenseFallback from "../../../../../../components/GeneralSuspenseFallback.tsx"
import GeneralErrorFallback from "../../../../../../components/GeneralErrorFallback.tsx"
import { useFetchEventDetail } from "../../../../../Results/services/FetchHooks.ts"
import NotFoundPage from "../../../../../NotFoundError/NotFoundPage.tsx"
import { apiErrorService } from "../../../../../../domain/services/ApiErrorService.ts"
import { useNotifications } from "@toolpad/core/useNotifications"

export default function EventAdmin() {
  const notifications = useNotifications()
  const { eventId } = useRequiredParams<{ eventId: string }>()
  const { data: eventData, error, isError, isLoading } = useFetchEventDetail(eventId)
  const detail = eventData?.data
  const { t } = useTranslation()
  const { token } = useAuth()

  // Functions to handle Event update
  const [isEventEditing, setIsEventEditing] = useState<boolean>(false)
  const handleUpdateEvent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    try {
      await patchEvent(
        eventId,
        data.get("description") as string,
        DateTime.fromFormat(data.get("startDate") as string, "dd/MM/yyyy").toSQLDate() as string,
        DateTime.fromFormat(data.get("endDate") as string, "dd/MM/yyyy").toSQLDate() as string,
        data.get("scope") as string,
        !!data.get("isPublic"),
        token as string,
        data.get("website") ? (data.get("website") as string) : undefined,
        undefined,
        data.get("organizerId") ? (data.get("organizerId") as string) : undefined,
      )
      setIsEventEditing(false)
    } catch (e) {
      notifications.show("Edit event failed. " + apiErrorService.toString(e), {
        autoHideDuration: 3000,
        severity: "error", // Could be 'success', 'error', 'warning', 'info'.
      })
    }
  }

  const handleCancelEditingEvent = () => {
    setIsEventEditing(false)
    //BUG, return to previous state
  }

  const handleClickEditEvent = () => setIsEventEditing(true)

  if (isLoading) {
    return <GeneralSuspenseFallback />
  } else if (isError) {
    const error_status = error.response?.status
    if (error_status == 404) {
      return <NotFoundPage />
    } else if (error_status == 403) {
      return (
        <Alert severity={"error"} variant={"outlined"} sx={{ margin: 5 }}>
          <AlertTitle>{t("ForbiddenAccess")}</AlertTitle>
        </Alert>
      )
    }

    return <GeneralErrorFallback />
  } else {
    return (
      <Container>
        <Box sx={{ marginY: "2em" }}>
          <Typography variant={"h3"}>{t("EventAdmin.EventData")}</Typography>
          <EventAdminForm
            eventDetail={detail as EventDetailModel}
            handleCancel={handleCancelEditingEvent}
            handleEdit={handleClickEditEvent}
            handleSubmit={(evt) => void handleUpdateEvent(evt)}
            canEdit={isEventEditing}
          />
        </Box>
        <Box sx={{ marginY: "2em" }}>
          <Typography variant={"h3"}>{t("QRCode.EventQRCode")}</Typography>
          {detail ? <QRCodeSection eventId={detail.id} eventName={detail.description} /> : <></>}
        </Box>
        <Box sx={{ marginY: "2em" }}>
          <Typography variant={"h3"}>{t("Stages")}</Typography>
          {detail ? <StagesDataGrid eventDetail={detail} /> : <></>}
        </Box>
        <Box sx={{ marginY: "2em" }}>
          <Typography variant={"h3"}>{t("EventAdmin.EventSecurityTokens")}</Typography>
          <EventTokenDataGrid event_id={detail ? detail.id : ""} />
        </Box>
        <Box sx={{ marginY: "12em" }}>
          <Typography variant={"h3"}>{t("EventAdmin.DangerArea")}</Typography>
          {detail ? <DeleteEventButton event={detail} /> : <></>}
        </Box>
      </Container>
    )
  }
}
