import { useTranslation } from "react-i18next"
import { OnlineControlModel } from "../../../../../../../../../../../shared/EntityTypes.ts"
import { CourseControlModel, getControlColumnHeader } from "../shared/footOSplitsTableFunctions.ts"
import CourseControlTableHeader from "./CourseControlTableHeader.tsx"
import SplitsTableHeaderCell from "./SplitsTableHeaderCell.tsx"

type SplitsTableHeaderCellsProps = {
  controlList: ReadonlyArray<CourseControlModel | OnlineControlModel>
  isWidthSizer?: boolean
  onlyRadios?: boolean
  showCleanTime: boolean
}

export default function SplitsTableHeaderCells({
  controlList,
  isWidthSizer,
  onlyRadios,
  showCleanTime,
}: SplitsTableHeaderCellsProps) {
  const { t } = useTranslation()
  const controlHeaders = controlList.map(getControlColumnHeader)

  return (
    <>
      <SplitsTableHeaderCell horizontalPadding="16px" isWidthSizer={isWidthSizer}>
        {t("ResultsStage.Times")}
      </SplitsTableHeaderCell>
      {showCleanTime && (
        <SplitsTableHeaderCell horizontalPadding="8px" isBold isWidthSizer={isWidthSizer} noWrap>
          {t("ResultsStage.SplitsTable.CleanTime")}
        </SplitsTableHeaderCell>
      )}
      {controlHeaders.map((controlHeader) => (
        <CourseControlTableHeader
          key={controlHeader.key}
          isWidthSizer={isWidthSizer}
          onlyRadios={onlyRadios}
          order_number={controlHeader.orderNumber}
          station={controlHeader.station}
        />
      ))}
    </>
  )
}
