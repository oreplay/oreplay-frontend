import { useEffect, useState } from "react"
import { useNotifications } from "@toolpad/core/useNotifications"
import { useTranslationRanking } from "../../../../../shared/useTranslationRanking.ts"
import { useNotifyError } from "../../../../../../../infrastructure/notifications/useNotifyError.ts"
import { useGetListStageClasses } from "../../../../../../../infrastructure/repositories/stage-classes/stage-classes.ts"
import { useGetListFedoStats } from "../../../../../../../infrastructure/repositories/fedo-stats/fedo-stats.ts"
import { GetListFedoStatsParams } from "../../../../../../../domain/types/v1api"
import ConfirmDialog from "../../../../../components/ConfirmDialog/ConfirmDialog.tsx"
import Spinner from "../../../../../components/Spinner/Spinner.tsx"
import PrimaryButton from "../../../../../components/PrimaryButton.tsx"
import CategorySelector from "./components/CategorySelector.tsx"
import StatsTable from "./components/StatsTable.tsx"
import {
  CategoryBucket,
  CategorySelection,
  EMPTY_SELECTION,
  initialSelection,
  moveClass,
  toFedoStatsParams,
} from "./shared/categorySelection.ts"
import { buildFedoStatsTables } from "./shared/fedoStatsTables.ts"
import { tablesToHtml, tablesToText, writeToClipboard } from "./shared/statsClipboard.ts"

interface StatsDialogProps {
  open: boolean
  onClose: () => void
  eventId: string
  stageId: string
}

const COPIED_NOTIFICATION_MS = 3000

export default function StatsDialog({ open, onClose, eventId, stageId }: StatsDialogProps) {
  const { t } = useTranslationRanking()
  const notifications = useNotifications()
  const notifyError = useNotifyError()
  const classesQuery = useGetListStageClasses(eventId, stageId)
  const [selection, setSelection] = useState<CategorySelection>(EMPTY_SELECTION)
  const [params, setParams] = useState<GetListFedoStatsParams | null>(null)

  useEffect(() => {
    setSelection(
      initialSelection((classesQuery.data?.data ?? []).map((entity) => entity.short_name)),
    )
  }, [classesQuery.data])

  const statsQuery = useGetListFedoStats(eventId, stageId, params ?? undefined, {
    query: { enabled: params !== null },
  })

  const tables = statsQuery.data ? buildFedoStatsTables(statsQuery.data.data) : null
  const computing = params !== null && statsQuery.isLoading

  const move = (className: string, bucket: CategoryBucket) =>
    setSelection((prev) => moveClass(prev, className, bucket))

  const copy = async () => {
    if (!tables) return
    const parts = [tables.official, tables.others]
    try {
      await writeToClipboard(tablesToHtml(parts, t), tablesToText(parts, t))
      notifications.show(t("common:copied"), {
        severity: "success",
        autoHideDuration: COPIED_NOTIFICATION_MS,
      })
    } catch (error) {
      notifyError(error)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      title={t("FedoStats.title")}
      confirmLabel={t("FedoStats.compute")}
      closeLabel={t("common:close")}
      size="lg"
      isConfirming={computing}
      onConfirm={() => setParams(toFedoStatsParams(selection))}
      onClose={onClose}
    >
      {classesQuery.isLoading ? (
        <Spinner label={t("common:loading")} />
      ) : (
        <div className="flex flex-col gap-4">
          <CategorySelector selection={selection} onMove={move} />
          {statsQuery.isError && <p className="text-sm text-red-600">{t("FedoStats.loadError")}</p>}
          {tables && (
            <div className="flex flex-col gap-4">
              <StatsTable table={tables.official} />
              <StatsTable table={tables.others} />
              <PrimaryButton onClick={() => void copy()} className="self-end">
                {t("common:copy")}
              </PrimaryButton>
            </div>
          )}
        </div>
      )}
    </ConfirmDialog>
  )
}
