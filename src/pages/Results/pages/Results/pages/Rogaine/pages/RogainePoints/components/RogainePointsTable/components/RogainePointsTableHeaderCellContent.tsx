import { useTranslation } from "react-i18next"
import { ScrollTableHeaderCellContentProps } from "../../../../../../../components/ScrollTable/shared/scrollTableProps.ts"
import {
  ROGAINE_POINTS_TABLE_COLUMN_KIND,
  RogainePointsTableColumn,
} from "../shared/rogainePointsTableColumns.ts"

const HEADER_LABEL_KEY = {
  [ROGAINE_POINTS_TABLE_COLUMN_KIND.Bonus]: "ResultsStage.BonusPoints",
  [ROGAINE_POINTS_TABLE_COLUMN_KIND.Penalty]: "ResultsStage.PenaltyPoints",
  [ROGAINE_POINTS_TABLE_COLUMN_KIND.Points]: "ResultsStage.Points",
  [ROGAINE_POINTS_TABLE_COLUMN_KIND.Time]: "ResultsStage.RaceTime",
} as const

/**
 * Header of a rogaine points table column: the score or time it holds, and nothing for a control
 * column, whose badges already show the station number.
 *
 * @param props.column The column the header names.
 */
export default function RogainePointsTableHeaderCellContent({
  column,
}: ScrollTableHeaderCellContentProps<RogainePointsTableColumn>) {
  const { t } = useTranslation()

  if (column.kind === ROGAINE_POINTS_TABLE_COLUMN_KIND.Control) return null
  return t(HEADER_LABEL_KEY[column.kind])
}
