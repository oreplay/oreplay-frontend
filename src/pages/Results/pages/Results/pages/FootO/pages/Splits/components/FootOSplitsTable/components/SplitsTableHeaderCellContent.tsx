import { Box } from "@mui/material"
import { useTranslation } from "react-i18next"
import { SPLITS_TABLE_COLUMN_KIND, SplitsTableColumn } from "../shared/splitsTableColumns.ts"
import CourseControlTableHeader from "./CourseControlTableHeader.tsx"
import { ScrollTableHeaderCellContentProps } from "./ScrollTable/shared/scrollTableProps.ts"

const CLEAN_TIME_SX = { fontWeight: "bold", whiteSpace: "nowrap" }

export default function SplitsTableHeaderCellContent({
  column,
}: ScrollTableHeaderCellContentProps<SplitsTableColumn>) {
  const { t } = useTranslation()

  if (column.kind === SPLITS_TABLE_COLUMN_KIND.Time) return t("ResultsStage.Times")
  if (column.kind === SPLITS_TABLE_COLUMN_KIND.CleanTime) {
    return (
      <Box component="span" sx={CLEAN_TIME_SX}>
        {t("ResultsStage.SplitsTable.CleanTime")}
      </Box>
    )
  }
  return <CourseControlTableHeader header={column.header} />
}
