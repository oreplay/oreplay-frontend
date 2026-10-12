import { useTranslation } from "react-i18next"
import {
  isSelectableItem,
  isSelectedItem,
  RUNNER_LIST_ITEM_STATE,
  RunnerListItem,
  RunnerListItemState,
} from "../../../shared/runnerList.ts"

interface RunnerListEntryProps {
  item: RunnerListItem
  onToggle: (runnerId: string) => void
}

const ENTRY_CLASS_BY_STATE: Record<RunnerListItemState, string> = {
  [RUNNER_LIST_ITEM_STATE.Selected]: "cursor-pointer text-neutral-900 hover:bg-neutral-100",
  [RUNNER_LIST_ITEM_STATE.Unavailable]: "cursor-not-allowed text-neutral-300",
  [RUNNER_LIST_ITEM_STATE.Unselected]: "cursor-pointer text-neutral-400 hover:bg-neutral-100",
}

const DOT_CLASS_BY_STATE: Record<RunnerListItemState, string> = {
  [RUNNER_LIST_ITEM_STATE.Selected]: "border-transparent",
  [RUNNER_LIST_ITEM_STATE.Unavailable]: "border-dashed border-neutral-300",
  [RUNNER_LIST_ITEM_STATE.Unselected]: "border-neutral-300",
}

/**
 * One runner of the list: a dot in the colour of its line, its name and its club. Clicking it adds
 * the runner to the graph or takes it out; a runner that is not plotted is greyed out, and one
 * without splits cannot be picked at all and shows the result status that explains it.
 *
 * @param props.item The runner to show.
 * @param props.onToggle Called with the runner id when the user clicks the runner.
 */
export default function RunnerListEntry({ item, onToggle }: RunnerListEntryProps) {
  const { t } = useTranslation()
  const dotStyle = { backgroundColor: item.color, borderColor: item.color }

  return (
    <li className="runner-list-entry">
      <label
        className={`flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors focus-within:ring-2 focus-within:ring-primary ${ENTRY_CLASS_BY_STATE[item.state]}`}
      >
        <input
          type="checkbox"
          className="sr-only"
          checked={isSelectedItem(item)}
          disabled={!isSelectableItem(item)}
          onChange={() => onToggle(item.id)}
        />
        <span
          aria-hidden="true"
          style={dotStyle}
          className={`h-3 w-3 shrink-0 rounded-full border-2 border-solid ${DOT_CLASS_BY_STATE[item.state]}`}
        />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium">{item.name}</span>
          {item.clubName && <span className="truncate text-xs opacity-80">{item.clubName}</span>}
        </span>
        {item.statusLabelKey && (
          <span className="shrink-0 text-xs font-semibold uppercase tracking-wide">
            {t(item.statusLabelKey)}
          </span>
        )}
      </label>
    </li>
  )
}
