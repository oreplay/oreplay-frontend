export const GUTTER_COLUMN_COUNT = 2

const GUTTER_WIDTH = "16px"
const GUTTER_SX = { content: '""', display: "block", width: GUTTER_WIDTH }

export const ROW_WITH_GUTTERS_SX = { "&:before": GUTTER_SX, "&:after": GUTTER_SX }

export function countSplitsTableColumns(controlCount: number, showCleanTime: boolean) {
  const timeColumnCount = 1
  const cleanTimeColumnCount = showCleanTime ? 1 : 0
  return timeColumnCount + cleanTimeColumnCount + controlCount
}
