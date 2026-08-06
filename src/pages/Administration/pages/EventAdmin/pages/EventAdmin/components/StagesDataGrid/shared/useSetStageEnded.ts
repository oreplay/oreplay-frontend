import { useQueryClient } from "react-query"
import { useNotifications } from "@toolpad/core/useNotifications"
import { useTranslation } from "react-i18next"
import { usePatchStages } from "../../../../../../../../../infrastructure/repositories/stages/stages.ts"
import { useNotifyError } from "../../../../../../../../../infrastructure/notifications/useNotifyError.ts"

const STATE_END_ON = 1
const STATE_END_OFF = 0

export function useSetStageEnded(eventId: string) {
  const queryClient = useQueryClient()
  const notifications = useNotifications()
  const notifyError = useNotifyError()
  const { t } = useTranslation()

  const mutation = usePatchStages({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries(["eventDetail", eventId])
        notifications.show(t("Success"), { severity: "success", autoHideDuration: 3000 })
      },
      onError: notifyError,
    },
  })

  return (stageId: string, shouldBeEnded: boolean) =>
    mutation.mutate({
      eventID: eventId,
      stageID: stageId,
      data: { state_end: shouldBeEnded ? STATE_END_ON : STATE_END_OFF },
    })
}
