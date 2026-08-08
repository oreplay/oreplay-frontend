import { useEffect, useState } from "react"
import { useNotifications } from "@toolpad/core/useNotifications"
import { useTranslationRanking } from "../../../shared/useTranslationRanking.ts"
import { useNotifyError } from "../../../../../infrastructure/notifications/useNotifyError.ts"
import { useGetListStageClasses } from "../../../../../infrastructure/repositories/stage-classes/stage-classes.ts"
import ConfirmDialog from "../../ConfirmDialog/ConfirmDialog.tsx"
import Spinner from "../../Spinner/Spinner.tsx"
import SpinnerRing from "../../SpinnerRing.tsx"
import ProgressBar from "../../ProgressBar.tsx"
import NumberField from "../../form/NumberField.tsx"
import SelectField from "../../form/SelectField.tsx"
import ClassMultiSelect from "./ClassMultiSelect.tsx"
import { collectTopRunners } from "../shared/collectTopRunners.ts"
import { downloadRankingPdf } from "../shared/downloadRankingPdf.ts"
import { DEFAULT_PDF_TEMPLATE, findPdfTemplate, PDF_TEMPLATES } from "../shared/templates/index.ts"

interface ExportResultsDialogProps {
  open: boolean
  onClose: () => void
  eventId: string
  stageId: string
}

const DEFAULT_TOP_COUNT = 3
const SUCCESS_NOTIFICATION_MS = 4000
const PDF_FILENAME = "diplomas"

export default function ExportResultsDialog({
  open,
  onClose,
  eventId,
  stageId,
}: ExportResultsDialogProps) {
  const { t } = useTranslationRanking()
  const notifications = useNotifications()
  const notifyError = useNotifyError()
  const classesQuery = useGetListStageClasses(eventId, stageId)
  const [templateId, setTemplateId] = useState(DEFAULT_PDF_TEMPLATE.id)
  const [topCount, setTopCount] = useState<number | null>(DEFAULT_TOP_COUNT)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [downloading, setDownloading] = useState(false)
  const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null)

  const options = (classesQuery.data?.data ?? []).map((entity) => ({
    id: entity.id,
    name: entity.short_name,
  }))

  useEffect(() => {
    setSelectedIds((classesQuery.data?.data ?? []).map((entity) => entity.id))
  }, [classesQuery.data])

  const toggle = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const canDownload =
    !classesQuery.isLoading && selectedIds.length > 0 && topCount !== null && topCount >= 1

  const download = async () => {
    if (topCount === null) return
    setDownloading(true)
    setProgress(null)
    try {
      const selectedClasses = options.filter((option) => selectedIds.includes(option.id))
      const runners = await collectTopRunners(
        eventId,
        stageId,
        selectedClasses,
        topCount,
        (completed, total) => setProgress({ completed, total }),
      )
      await downloadRankingPdf(findPdfTemplate(templateId), runners, PDF_FILENAME)
      notifications.show(t("ExportResults.success"), {
        severity: "success",
        autoHideDuration: SUCCESS_NOTIFICATION_MS,
      })
      onClose()
    } catch (error) {
      setDownloading(false)
      notifyError(error)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      title={t("ExportResults.title")}
      confirmLabel={t("ExportResults.download")}
      closeLabel={t("common:close")}
      isConfirming={downloading}
      confirmDisabled={!canDownload}
      onConfirm={() => void download()}
      onClose={onClose}
    >
      {classesQuery.isLoading ? (
        <Spinner label={t("common:loading")} />
      ) : downloading ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <SpinnerRing className="h-4 w-4 border-2 border-primary" />
            <span className="text-sm text-neutral-600">
              {progress ? `${progress.completed} / ${progress.total}` : t("common:loading")}
            </span>
          </div>
          {progress && <ProgressBar value={progress.completed} max={progress.total} />}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <SelectField
            label={t("ExportResults.template")}
            value={templateId}
            onChange={setTemplateId}
            options={PDF_TEMPLATES.map((template) => ({
              value: template.id,
              label: t(template.labelKey),
            }))}
          />
          <NumberField
            label={t("ExportResults.topCount")}
            required
            value={topCount}
            onChange={setTopCount}
          />
          <ClassMultiSelect
            label={t("ExportResults.classes")}
            options={options}
            selectedIds={selectedIds}
            onToggle={toggle}
            onSelectAll={() => setSelectedIds(options.map((option) => option.id))}
            onClearAll={() => setSelectedIds([])}
          />
        </div>
      )}
    </ConfirmDialog>
  )
}
