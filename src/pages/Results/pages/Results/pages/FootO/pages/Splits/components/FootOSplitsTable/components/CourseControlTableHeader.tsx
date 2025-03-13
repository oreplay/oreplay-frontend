import { ControlModel } from "../../../../../../../../../../../shared/EntityTypes.ts"
import { TableCell, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

type CourseControlTableHeaderProps = {
  order_number: number | bigint
  control: ControlModel | null
  onlyRadios?: boolean
}

export default function CourseControlTableHeader({
  order_number,
  control,
  onlyRadios,
}: CourseControlTableHeaderProps) {
  const { t } = useTranslation()

  if (order_number === Infinity) {
    return (
      <TableCell key={"Finish Control"}>
        <Typography>{t("ResultsStage.VirtualTicket.FinishControl")}</Typography>
      </TableCell>
    )
  } else {
    if (!control) {
      throw new Error("Control is missing")
    }

    const controlString = onlyRadios
      ? `(${control.station})`
      : `${order_number} (${control.station})`
    return (
      <TableCell key={control.id}>
        <Typography>{controlString}</Typography>
      </TableCell>
    )
  }
}
