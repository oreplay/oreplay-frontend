import { SPLITS_TABLE_COLUMN_KIND, SplitsTableColumn } from "../shared/splitsTableColumns.ts"
import { SplitsTableRow } from "../shared/splitsTableRows.ts"
import RunnerCleanTime from "./RunnerCleanTime.tsx"
import RunnerControlSplit from "./RunnerControlSplit.tsx"
import RunnerTime from "./RunnerTime.tsx"
import { ScrollTableCellContentProps } from "./ScrollTable/shared/scrollTableProps.ts"

export default function SplitsTableCell({
  column,
  row,
}: ScrollTableCellContentProps<SplitsTableColumn, SplitsTableRow>) {
  if (column.kind === SPLITS_TABLE_COLUMN_KIND.Time) return <RunnerTime runner={row.runner} />
  if (column.kind === SPLITS_TABLE_COLUMN_KIND.CleanTime) {
    return <RunnerCleanTime runner={row.runner} />
  }
  return <RunnerControlSplit runner={row.runner} split={row.splits.at(column.splitIndex)} />
}
