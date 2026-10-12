import { useTranslation } from "react-i18next"

interface RunnerListHeaderProps {
  areAllSelected: boolean
  onToggleAll: () => void
  selectableCount: number
  selectedCount: number
}

/**
 * Heading of the runner list: how many runners are plotted, and a button that selects every runner
 * or, once they all are, clears the selection.
 *
 * @param props.areAllSelected Whether every selectable runner is already selected.
 * @param props.onToggleAll Called when the user clicks the select all / clear button.
 * @param props.selectableCount Number of runners that can be plotted.
 * @param props.selectedCount Number of runners currently plotted.
 */
export default function RunnerListHeader({
  areAllSelected,
  onToggleAll,
  selectableCount,
  selectedCount,
}: RunnerListHeaderProps) {
  const { t } = useTranslation()
  const toggleAllLabel = areAllSelected ? t("Graphs.ClearSelection") : t("Graphs.SelectAll")

  return (
    <div className="runner-list-header flex items-center justify-between gap-2 px-2 pb-2">
      <p className="m-0 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {t("Graphs.SelectedCount", { count: selectedCount, total: selectableCount })}
      </p>
      <button
        type="button"
        disabled={selectableCount === 0}
        onClick={onToggleAll}
        className="cursor-pointer rounded-md border-0 bg-transparent px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {toggleAllLabel}
      </button>
    </div>
  )
}
