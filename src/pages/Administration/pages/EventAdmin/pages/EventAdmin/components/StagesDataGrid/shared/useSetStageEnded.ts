import { useQueryClient } from "react-query"
import { useNotifications } from "@toolpad/core/useNotifications"
import { useTranslation } from "react-i18next"
import { usePatchStages } from "../../../../../../../../../infrastructure/repositories/stages/stages.ts"
import { useNotifyError } from "../../../../../../../../../infrastructure/notifications/useNotifyError.ts"
import { getEventDetailQueryKey } from "../../../../../../../../Results/services/FetchHooks.ts"

const SUCCESS_NOTIFICATION_DURATION = 3000

/**
 * Builds the action that makes a stage's results official or provisional again. On success it
 * reloads the event detail before confirming, so the stages table already shows the new state when
 * the organizer reads the success message; a failure is reported with an error snackbar.
 * @param eventId Event the stages belong to.
 * @returns A function taking the stage id and whether its results should be official. Its promise
 * settles once the table is up to date or the failure has been reported, and never rejects, so
 * callers can await it to show a pending state.
 */
export function useSetStageEnded(eventId: string) {
  const queryClient = useQueryClient()
  const notifications = useNotifications()
  const notifyError = useNotifyError()
  const { t } = useTranslation()

  const mutation = usePatchStages({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries(getEventDetailQueryKey(eventId))
        notifications.show(t("Success"), {
          severity: "success",
          autoHideDuration: SUCCESS_NOTIFICATION_DURATION,
        })
      },
      onError: notifyError,
    },
  })

  return async (stageId: string, shouldBeEnded: boolean): Promise<void> => {
    try {
      await mutation.mutateAsync({
        eventID: eventId,
        stageID: stageId,
        data: { state_end: shouldBeEnded },
      })
    } catch {
      return
    }
  }
}
