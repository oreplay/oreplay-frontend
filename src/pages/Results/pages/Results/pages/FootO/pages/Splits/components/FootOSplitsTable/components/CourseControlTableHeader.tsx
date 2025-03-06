import { ControlModel } from "../../../../../../../../../../../shared/EntityTypes.ts"
import { TableCell, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

type CourseControlTableHeaderProps = {
  order_number: number | bigint
  control: ControlModel | null
}

export default function CourseControlTableHeader({
  order_number,
  control,
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

    return (
      <TableCell key={control.id}>
        <Typography>{`${order_number} (${control.station})`}</Typography>
      </TableCell>
    )
  }
}
