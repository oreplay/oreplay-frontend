import { useTranslationRanking } from "../../../shared/useTranslationRanking.ts"
import { RankingOrganizer } from "../../../../../domain/types/v1api"
import Spinner from "../../../components/Spinner/Spinner.tsx"
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog.tsx"
import RankingOrganizerListItem from "./RankingOrganizerListItem.tsx"
import { usePendingRemoval } from "../shared/usePendingRemoval.ts"

interface RankingOrganizerListProps {
  organizers: RankingOrganizer[]
  isLoading: boolean
  isError: boolean
  isRemoving: boolean
  /** Resolves `true` when the organizer was removed, so the dialog closes. */
  onRemove: (organizer: RankingOrganizer) => Promise<boolean>
}

export default function RankingOrganizerList({
  organizers,
  isLoading,
  isError,
  isRemoving,
  onRemove,
}: RankingOrganizerListProps) {
  const { t } = useTranslationRanking()
  const removal = usePendingRemoval(onRemove)

  if (isLoading) {
    return <Spinner label={t("common:loading")} />
  }

  if (isError) {
    return (
      <p className="rk-ranking-organizer-list text-red-600">{t("RankingOrganizers.loadError")}</p>
    )
  }

  if (organizers.length === 0) {
    return (
      <p className="rk-ranking-organizer-list text-neutral-500">{t("RankingOrganizers.empty")}</p>
    )
  }

  return (
    <>
      <ul className="rk-ranking-organizer-list m-0 flex list-none flex-col gap-3 p-0">
        {organizers.map((organizer) => (
          <RankingOrganizerListItem
            key={organizer.id}
            organizer={organizer}
            onRemove={() => removal.request(organizer)}
          />
        ))}
      </ul>
      <ConfirmDialog
        open={removal.pending !== null}
        title={t("RankingOrganizers.removeTitle")}
        confirmLabel={t("common:delete")}
        closeLabel={t("common:close")}
        isConfirming={isRemoving}
        destructive
        onConfirm={() => void removal.confirm()}
        onClose={removal.cancel}
      >
        <p className="m-0 text-sm text-neutral-600">{t("common:deleteConfirm")}</p>
      </ConfirmDialog>
    </>
  )
}
