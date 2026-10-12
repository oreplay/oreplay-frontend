import "../../../../../../../../../../styles/tokens.css"
import "../../../../../../../../../../styles/tailwind.css"
import { useTranslation } from "react-i18next"
import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import {
  areAllRunnersSelected,
  buildRunnerListItems,
  selectableRunnerIds,
  selectedRunnerCount,
  toggleRunnerId,
} from "../../shared/runnerList.ts"
import RunnerListEntry from "./components/RunnerListEntry.tsx"
import RunnerListHeader from "./components/RunnerListHeader.tsx"

interface RunnerListProps {
  onSelectionChange: (runnerIds: string[]) => void
  runners: ProcessedRunnerModel[]
  selectedRunnerIds: string[]
  className?: string
}

/**
 * List of every runner of the class, used to pick the ones plotted in the graph. It doubles as the
 * legend of the graph: each plotted runner carries the colour of its line.
 *
 * @param props.onSelectionChange Called with the new selection when the user changes it.
 * @param props.runners Runners of the class.
 * @param props.selectedRunnerIds Ids of the runners currently plotted.
 * @param props.className Extra classes for the root, such as its size in the page layout.
 */
export default function RunnerList({
  onSelectionChange,
  runners,
  selectedRunnerIds,
  className = "",
}: RunnerListProps) {
  const { t } = useTranslation()
  const items = buildRunnerListItems(runners, selectedRunnerIds)
  const areAllSelected = areAllRunnersSelected(items)
  const selectableIds = selectableRunnerIds(items)

  return (
    <section
      aria-label={t("Graphs.RunnerSelection")}
      className={`runner-list tw-root flex flex-col font-sans ${className}`}
    >
      <RunnerListHeader
        areAllSelected={areAllSelected}
        onToggleAll={() => onSelectionChange(areAllSelected ? [] : selectableIds)}
        selectableCount={selectableIds.length}
        selectedCount={selectedRunnerCount(items)}
      />
      <ul className="m-0 flex min-h-0 flex-1 list-none flex-col gap-0.5 overflow-y-auto p-0">
        {items.map((item) => (
          <RunnerListEntry
            key={item.id}
            item={item}
            onToggle={(runnerId) => onSelectionChange(toggleRunnerId(selectedRunnerIds, runnerId))}
          />
        ))}
      </ul>
    </section>
  )
}
