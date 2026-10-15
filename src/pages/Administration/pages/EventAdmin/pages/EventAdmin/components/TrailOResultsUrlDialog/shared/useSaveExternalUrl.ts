import { useMutation, useQueryClient } from "react-query"
import { useNotifications } from "@toolpad/core/useNotifications"
import { useTranslation } from "react-i18next"
import { patchStageExternalUrl } from "../../../../../../../services/EventAdminService.ts"
import { useAuth } from "../../../../../../../../../shared/hooks.ts"
import { useNotifyError } from "../../../../../../../../../infrastructure/notifications/useNotifyError.ts"

const SUCCESS_NOTIFICATION_DURATION = 3000

/**
 * Saves the URL where the results of a Trail-O stage are published, then refreshes the event and
 * tells the organiser whether it worked.
 *
 * @param eventId Event the stage belongs to.
 * @param stageId Stage whose results URL is saved.
 * @param onSaved Called with the saved URL (`null` when it was removed) once the backend accepts it.
 * @returns The mutation; call `mutate` with the URL and read `isLoading` for the pending state.
 */
export function useSaveExternalUrl(
  eventId: string,
  stageId: string,
  onSaved: (externalUrl: string | null) => void,
) {
  const { t } = useTranslation()
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const notifications = useNotifications()
  const notifyError = useNotifyError()

  return useMutation(
    (externalUrl: string | null) =>
      patchStageExternalUrl(eventId, stageId, externalUrl, token as string),
    {
      onSuccess: (_, externalUrl) => {
        void queryClient.invalidateQueries(["eventDetail", eventId])
        notifications.show(t("EventAdmin.Stages.TrailOResultsUrl.Saved"), {
          autoHideDuration: SUCCESS_NOTIFICATION_DURATION,
          severity: "success",
        })
        onSaved(externalUrl)
      },
      onError: notifyError,
    },
  )
}
