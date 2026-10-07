import { OnlineControlModel } from "../../../../../../../../../../../shared/EntityTypes.ts"
import {
  ControlColumnHeader,
  CourseControlModel,
  getControlColumnHeader,
} from "./footOSplitsTableFunctions.ts"

export const SPLITS_TABLE_COLUMN_KIND = {
  CleanTime: "cleanTime",
  Control: "control",
  Time: "time",
} as const

export type SplitsTableControlColumn = {
  header: ControlColumnHeader
  kind: typeof SPLITS_TABLE_COLUMN_KIND.Control
  splitIndex: number
}

export type SplitsTableColumn =
  | SplitsTableControlColumn
  | { kind: typeof SPLITS_TABLE_COLUMN_KIND.CleanTime }
  | { kind: typeof SPLITS_TABLE_COLUMN_KIND.Time }

const CLEAN_TIME_COLUMN: SplitsTableColumn = { kind: SPLITS_TABLE_COLUMN_KIND.CleanTime }
const TIME_COLUMN: SplitsTableColumn = { kind: SPLITS_TABLE_COLUMN_KIND.Time }

export function buildSplitsTableColumns(
  controlList: ReadonlyArray<CourseControlModel | OnlineControlModel>,
  showCleanTime: boolean,
): SplitsTableColumn[] {
  const controlColumns = controlList.map(
    (control, splitIndex): SplitsTableControlColumn => ({
      header: getControlColumnHeader(control),
      kind: SPLITS_TABLE_COLUMN_KIND.Control,
      splitIndex,
    }),
  )
  const cleanTimeColumns = showCleanTime ? [CLEAN_TIME_COLUMN] : []
  return [TIME_COLUMN, ...cleanTimeColumns, ...controlColumns]
}

export function getSplitsTableColumnKey(column: SplitsTableColumn): string {
  return column.kind === SPLITS_TABLE_COLUMN_KIND.Control ? column.header.key : column.kind
}
