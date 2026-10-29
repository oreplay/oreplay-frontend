export const OFFICIAL_LOCKED_CELL_CLASS = "official-locked-cell"

export const OFFICIAL_LOCKED_STAGE_FIELDS = ["stageTypeId", "start"] as const
export type OfficialLockedStageField = (typeof OFFICIAL_LOCKED_STAGE_FIELDS)[number]

/**
 * Whether a column of the admin stages table can be edited on a stage's row. Official results must
 * not change, so the stage type and zero time are locked once the stage is official; the name stays
 * editable because it does not affect the results.
 * @param field Column field of the cell.
 * @param isOfficial Whether the stage of the row is labeled as official.
 * @returns False only for a locked field on an official stage.
 */
export function isStageFieldEditable(field: string, isOfficial: boolean): boolean {
  const isLockedField = (OFFICIAL_LOCKED_STAGE_FIELDS as readonly string[]).includes(field)
  return !(isOfficial && isLockedField)
}

/**
 * CSS class for a cell of the admin stages table, greying out the locked fields of an official stage
 * while its row is being edited, so the organizer sees why those cells do not turn into inputs.
 * @param field Column field of the cell.
 * @param isOfficial Whether the stage of the row is labeled as official.
 * @param isRowInEditMode Whether the row is currently being edited.
 * @returns The locked-cell class, or an empty string when the cell looks as usual.
 */
export function getStageCellClassName(
  field: string,
  isOfficial: boolean,
  isRowInEditMode: boolean,
): string {
  const isLocked = isRowInEditMode && !isStageFieldEditable(field, isOfficial)
  return isLocked ? OFFICIAL_LOCKED_CELL_CLASS : ""
}
