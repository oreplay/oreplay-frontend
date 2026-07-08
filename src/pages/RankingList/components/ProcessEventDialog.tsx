import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useQuery } from "react-query"
import { getListEvents } from "../../../infrastructure/repositories/events/events.ts"
import { getListStages } from "../../../infrastructure/repositories/stages/stages.ts"
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog.tsx"
import SearchableSelect from "../../../components/form/SearchableSelect.tsx"
import { calculateRankingBatches } from "../../../infrastructure/ranking/calculateRankingBatches.ts"
import { useNotifyError } from "../../../infrastructure/notifications/useNotifyError.ts"

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(id)
  }, [value, delayMs])
  return debounced
}

interface ProcessEventDialogProps {
  open: boolean
  onClose: () => void
  rankingId: string
}

export default function ProcessEventDialog({ open, onClose, rankingId }: ProcessEventDialogProps) {
  const { t } = useTranslation()
  const notifyError = useNotifyError()
  const [eventId, setEventId] = useState<string | null>(null)
  const [stageId, setStageId] = useState<string | null>(null)
  const [eventSearch, setEventSearch] = useState("")
  const [processing, setProcessing] = useState(false)
  const description = useDebouncedValue(eventSearch, 300)

  const events = useQuery(
    ["events", description],
    () => getListEvents({ limit: "50", show_hidden: "false", description }),
    { enabled: open },
  )
  const stages = useQuery(["stages", eventId], () => getListStages(eventId ?? ""), {
    enabled: open && eventId !== null,
  })

  const eventOptions = (events.data?.data ?? []).map((e) => ({
    value: e.id,
    label: e.description,
  }))
  const stageOptions = (stages.data?.data ?? []).map((s) => ({
    value: s.id,
    label: s.description,
  }))

  const close = () => {
    setEventId(null)
    setStageId(null)
    setEventSearch("")
    setProcessing(false)
    onClose()
  }

  const confirm = async () => {
    if (eventId === null || stageId === null) return
    setProcessing(true)
    try {
      await calculateRankingBatches(rankingId, eventId, stageId)
      close()
    } catch (error) {
      setProcessing(false)
      notifyError(error)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      title={t("Ranking.ProcessEvent.title")}
      confirmLabel={t("Ranking.gui.confirm")}
      closeLabel={t("Ranking.gui.close")}
      onConfirm={() => void confirm()}
      isConfirming={processing}
      onClose={close}
    >
      <div className="flex flex-col gap-4">
        <SearchableSelect
          label={t("Ranking.ProcessEvent.event")}
          value={eventId}
          onChange={(value) => {
            setEventId(value)
            setStageId(null)
          }}
          onSearch={setEventSearch}
          options={eventOptions}
          noResultsLabel={t("Ranking.gui.noResults")}
          placeholder={t("Ranking.gui.search")}
        />
        <SearchableSelect
          label={t("Ranking.ProcessEvent.stage")}
          value={stageId}
          onChange={setStageId}
          options={stageOptions}
          noResultsLabel={t("Ranking.gui.noResults")}
          placeholder={t("Ranking.gui.search")}
          disabled={eventId === null}
        />
      </div>
    </ConfirmDialog>
  )
}
