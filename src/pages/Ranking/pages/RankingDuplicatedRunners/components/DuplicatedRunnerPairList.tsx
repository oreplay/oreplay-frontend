import { useTranslationRanking } from "../../../shared/useTranslationRanking.ts"
import Spinner from "../../../components/Spinner/Spinner.tsx"
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog.tsx"
import { usePendingRemoval } from "../../../shared/usePendingRemoval.ts"
import { useDuplicatedRunners } from "../shared/useDuplicatedRunners.ts"
import DuplicatedRunnersTable from "./DuplicatedRunnersTable/DuplicatedRunnersTable.tsx"

interface DuplicatedRunnerPairListProps {
  eventId: string
  stageId: string
}

export default function DuplicatedRunnerPairList({
  eventId,
  stageId,
}: DuplicatedRunnerPairListProps) {
  const { t } = useTranslationRanking()
  const { pairs, isLoading, isError, remove } = useDuplicatedRunners(eventId, stageId)
  const removal = usePendingRemoval(remove)

  if (isLoading) {
    return <Spinner label={t("common:loading")} />
  }

  if (isError) {
    return (
      <p className="rk-duplicated-runner-pair-list m-0 text-red-600">
        {t("DuplicatedRunners.loadError")}
      </p>
    )
  }

  if (pairs.length === 0) {
    return (
      <p className="rk-duplicated-runner-pair-list m-0 text-neutral-500">
        {t("DuplicatedRunners.empty")}
      </p>
    )
  }

  return (
    <div className="rk-duplicated-runner-pair-list">
      <DuplicatedRunnersTable
        pairs={pairs}
        eventId={eventId}
        stageId={stageId}
        onRemove={removal.request}
      />
      <ConfirmDialog
        open={removal.pending !== null}
        title={t("DuplicatedRunners.removeTitle")}
        confirmLabel={t("DuplicatedRunners.remove")}
        closeLabel={t("common:close")}
        isConfirming={removal.isConfirming}
        destructive
        onConfirm={() => void removal.confirm()}
        onClose={removal.cancel}
      >
        <p className="m-0 text-sm text-neutral-600">
          {t("DuplicatedRunners.removeConfirm", { name: removal.pending?.full_name })}
        </p>
      </ConfirmDialog>
    </div>
  )
}
