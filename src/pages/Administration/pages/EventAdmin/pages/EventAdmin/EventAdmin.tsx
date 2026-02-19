import EventAdminForm, { EventAdminFormValues } from "../../components/EventAdminForm"
import { Alert, AlertTitle, Box, Container, Divider, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import StagesDataGrid from "./components/StagesDataGrid.tsx"
import EventTokenDataGrid from "./components/EventTokenDataGrid.tsx"
import DeleteEventButton from "./components/DeleteEventButton.tsx"
import { useState } from "react"
import { patchEvent } from "../../../../services/EventAdminService.ts"
import { EventDetailModel, useRequiredParams } from "../../../../../../shared/EntityTypes.ts"
import { useAuth } from "../../../../../../shared/hooks.ts"
import GeneralSuspenseFallback from "../../../../../../components/GeneralSuspenseFallback.tsx"
import GeneralErrorFallback from "../../../../../../components/GeneralErrorFallback.tsx"
import { useFetchEventDetail } from "../../../../../Results/services/FetchHooks.ts"
import NotFoundPage from "../../../../../NotFoundError/NotFoundPage.tsx"
import { apiErrorService } from "../../../../../../domain/services/ApiErrorService.ts"
import { useNotifications } from "@toolpad/core/useNotifications"
import { useMutation, useQueryClient } from "react-query"
import { AxiosError } from "axios"

export default function EventAdmin() {
  const notifications = useNotifications()
  const { eventId } = useRequiredParams<{ eventId: string }>()
  const { data: eventData, error, isError, isLoading } = useFetchEventDetail(eventId)
  const queryClient = useQueryClient()
  const detail = eventData?.data
  const { t } = useTranslation()
  const { token } = useAuth()

  // Functions to handle Event update
  const [isEventEditing, setIsEventEditing] = useState<boolean>(false)

  const updateEventMutation = useMutation<
    EventDetailModel,
    AxiosError<EventDetailModel>,
    EventAdminFormValues
  >(
    (values) =>
      patchEvent(
        eventId,
        values.description,
        values.startDate?.toSQLDate() as string,
        values.endDate?.toSQLDate() as string,
        values.scope,
        values.isPublic,
        token as string,
        values.website,
        undefined,
        values.organizer?.id,
      ),
    {
      onMutate: async (values: EventAdminFormValues) => {
        await queryClient.cancelQueries({ queryKey: ["eventDetail", eventId] })

        const previous = queryClient.getQueryData<EventDetailModel>(["eventDetail", eventId])

        // Optimistic update
        queryClient.setQueryData<EventDetailModel>(
          ["eventDetail", eventId],
          (old: EventDetailModel | undefined): EventDetailModel => {
            return {
              ...old!,
              id: old?.id ?? "",
              description: values.description,
              website: values.website as string,
              organizer: values.organizer,
              initial_date: values.startDate?.toSQLDate() ?? "",
              final_date: values.endDate?.toSQLDate() ?? "",
              scope: values.scope,
              is_hidden: !values.isPublic,
            }
          },
        )

        return { previous }
      },
      onError: (err, context) => {
        queryClient.setQueryData(["eventDetail", eventId], context)
        notifications.show("Edit event failed. " + apiErrorService.toString(err), {
          autoHideDuration: 3000,
          severity: "error",
        })
      },
      onSettled: () => {
        void queryClient.invalidateQueries(["eventDetail", eventId])
      },
    },
  )
  const handleUpdateEvent = (values: EventAdminFormValues) => {
    updateEventMutation.mutate(values)
    setIsEventEditing(false)
  }

  const handleCancelEditingEvent = () => {
    setIsEventEditing(false)
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
      <Box sx={{ height: "100%", backgroundColor: "#f6f6f6", py: 6 }}>
        <Container maxWidth={"md"}>
          {/* Header information */}
          <Typography component="h1" variant="h5" fontWeight={600} gutterBottom>
            {detail?.description}
          </Typography>
          <Typography component="p" variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            {detail?.organizer?.name}
          </Typography>
          <Divider sx={{ mb: 4 }} />

          {/* Event's information */}
          <Typography component="h2" variant="h6" fontWeight={500} sx={{ mb: 1 }}>
            {t("EventAdmin.EventData")}
          </Typography>
          <Typography component="p" variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t("EventAdmin.EventDataDescription")}
          </Typography>
          <EventAdminForm
            eventDetail={detail as EventDetailModel}
            handleCancel={handleCancelEditingEvent}
            handleEdit={handleClickEditEvent}
            handleSubmit={(values) => void handleUpdateEvent(values)}
            canEdit={isEventEditing}
            displayIsPublic
          />

          {/* Stages  */}
          <Typography component="h2" variant="h6" fontWeight={500} sx={{ mt: 4, mb: 1 }}>
            {t("Stages")}
          </Typography>
          <Typography component="p" variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t("EventAdmin.Stages.description")}
          </Typography>
          {detail ? <StagesDataGrid eventDetail={detail} /> : <></>}

          {/* Upload data */}
          <Typography component="h2" variant="h6" fontWeight={500} sx={{ mt: 4, mb: 1 }}>
            {t("EventAdmin.DataUpload.title")}
          </Typography>
          <Typography component="p" variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t("EventAdmin.DataUpload.description")}
          </Typography>
          <Box sx={{ paddingX: 4, paddingY: 1, borderRadius: 3, backgroundColor: "white" }}>
            <EventTokenDataGrid event_id={detail ? detail.id : ""} />
          </Box>

          {/* Danger zone */}
          <Typography component="h2" variant="h6" fontWeight={500} sx={{ mt: 4, mb: 2 }}>
            {t("EventAdmin.DangerArea")}
          </Typography>
          <Box sx={{ p: 4, borderRadius: 3, backgroundColor: "white" }}>
            {detail ? <DeleteEventButton event={detail} /> : <></>}
          </Box>
        </Container>
      </Box>
    )
  }
}
