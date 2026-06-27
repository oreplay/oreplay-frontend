import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useDeleteRankingSettings } from "../../../infrastructure/repositories/ranking-settings/ranking-settings.ts"
import { notifyError } from "../../../infrastructure/notifications/notifications.ts"
import { httpErrorMessageKey } from "../../../infrastructure/notifications/httpError.ts"
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog.tsx"

interface DeleteRankingButtonProps {
  rankingId: string
}

export default function DeleteRankingButton({
  rankingId,
}: DeleteRankingButtonProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const deleteRanking = useDeleteRankingSettings()

  const confirmDelete = async () => {
    try {
      await deleteRanking.mutateAsync({ rankingID: rankingId })
      void navigate("/ranking")
    } catch (error) {
      setOpen(false)
      notifyError(t(httpErrorMessageKey(error)))
    }
  }

  return (
    <div className="rk-delete-ranking-button">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded border border-red-600 px-4 py-2 font-medium text-red-600 transition-colors hover:bg-red-50"
      >
        {t("Ranking.gui.delete")}
      </button>
      <ConfirmDialog
        open={open}
        title={t("Ranking.gui.deleteConfirm")}
        confirmLabel={t("Ranking.gui.ok")}
        closeLabel={t("Ranking.gui.close")}
        isConfirming={deleteRanking.isLoading}
        destructive
        onConfirm={() => void confirmDelete()}
        onClose={() => setOpen(false)}
      />
    </div>
  )
}
