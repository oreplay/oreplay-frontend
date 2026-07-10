import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useDeleteRankingSettings } from "../../../../../infrastructure/repositories/ranking-settings/ranking-settings.ts"
import { useDeleteEvents } from "../../../../../infrastructure/repositories/events/events.ts"
import { useNotifyError } from "../../../../../infrastructure/notifications/useNotifyError.ts"
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog.tsx"

interface DeleteRankingButtonProps {
  rankingId: string
  eventId: string
}

export default function DeleteRankingButton({ rankingId, eventId }: DeleteRankingButtonProps) {
  const { t } = useTranslation()
  const notifyError = useNotifyError()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [alsoDeleteEvent, setAlsoDeleteEvent] = useState(false)
  const deleteRanking = useDeleteRankingSettings()
  const deleteEvent = useDeleteEvents()

  const close = () => {
    setOpen(false)
    setAlsoDeleteEvent(false)
  }

  const confirmDelete = async () => {
    try {
      await deleteRanking.mutateAsync({ rankingID: rankingId })
      if (alsoDeleteEvent) {
        await deleteEvent.mutateAsync({ eventID: eventId })
      }
      void navigate("/rankings")
    } catch (error) {
      close()
      notifyError(error)
    }
  }

  return (
    <div className="rk-delete-ranking-button">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded border border-red-600 px-4 py-2 font-medium text-red-600 transition-colors hover:bg-red-50"
      >
        {t("common:delete")}
      </button>
      <ConfirmDialog
        open={open}
        title={t("common:deleteConfirm")}
        confirmLabel={t("common:ok")}
        closeLabel={t("common:close")}
        isConfirming={deleteRanking.isLoading || deleteEvent.isLoading}
        destructive
        onConfirm={() => void confirmDelete()}
        onClose={close}
      >
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={alsoDeleteEvent}
            onChange={(event) => setAlsoDeleteEvent(event.target.checked)}
          />
          {t("Ranking.Settings.deleteEventToo")}
        </label>
      </ConfirmDialog>
    </div>
  )
}
