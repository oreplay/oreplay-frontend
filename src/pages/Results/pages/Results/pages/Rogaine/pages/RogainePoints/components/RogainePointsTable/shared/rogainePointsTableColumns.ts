export const ROGAINE_POINTS_TABLE_COLUMN_KIND = {
  Bonus: "bonus",
  Control: "control",
  Penalty: "penalty",
  Points: "points",
  Time: "time",
} as const

export type RogainePointsTableControlColumn = {
  kind: typeof ROGAINE_POINTS_TABLE_COLUMN_KIND.Control
  station: bigint
}

export type RogainePointsTableScoreColumn = {
  kind:
    | typeof ROGAINE_POINTS_TABLE_COLUMN_KIND.Bonus
    | typeof ROGAINE_POINTS_TABLE_COLUMN_KIND.Penalty
    | typeof ROGAINE_POINTS_TABLE_COLUMN_KIND.Points
}

export type RogainePointsTableColumn =
  | RogainePointsTableControlColumn
  | RogainePointsTableScoreColumn
  | { kind: typeof ROGAINE_POINTS_TABLE_COLUMN_KIND.Time }

const SCORE_AND_TIME_COLUMNS: readonly RogainePointsTableColumn[] = [
  { kind: ROGAINE_POINTS_TABLE_COLUMN_KIND.Bonus },
  { kind: ROGAINE_POINTS_TABLE_COLUMN_KIND.Penalty },
  { kind: ROGAINE_POINTS_TABLE_COLUMN_KIND.Points },
  { kind: ROGAINE_POINTS_TABLE_COLUMN_KIND.Time },
]

/**
 * Columns of the rogaine points table: bonus, penalty, final points and race time, then one
 * column per control of the class.
 *
 * @param controlStations Station numbers of the class's controls, in the order they are shown.
 *   Empty when the class has no controls, leaving only the score and time columns.
 * @returns The table columns, from left to right.
 */
export function buildRogainePointsTableColumns(
  controlStations: readonly bigint[],
): RogainePointsTableColumn[] {
  const controlColumns = controlStations.map(
    (station): RogainePointsTableControlColumn => ({
      kind: ROGAINE_POINTS_TABLE_COLUMN_KIND.Control,
      station,
    }),
  )
  return [...SCORE_AND_TIME_COLUMNS, ...controlColumns]
}

/**
 * Key that identifies a column of the rogaine points table among its siblings.
 *
 * @param column The column to identify.
 * @returns The column kind, suffixed with the station number for a control column.
 */
export function getRogainePointsTableColumnKey(column: RogainePointsTableColumn): string {
  return column.kind === ROGAINE_POINTS_TABLE_COLUMN_KIND.Control
    ? `${column.kind}-${column.station}`
    : column.kind
}
