import { TableCell, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

type CourseControlTableHeaderProps = {
  order_number?: number | null
  station?: number | string | null
  onlyRadios?: boolean
  colWidth?: number
}

export default function CourseControlTableHeader({
  order_number,
  station,
  onlyRadios,
  colWidth,
}: CourseControlTableHeaderProps) {
  const { t } = useTranslation()

  if (station === "Finish" || order_number === Infinity) {
    return (
      <TableCell key={"Finish Control"} sx={colWidth ? { minWidth: colWidth } : {}}>
        <Typography>{t("ResultsStage.VirtualTicket.FinishControl")}</Typography>
      </TableCell>
    )
  }

  const controlString = onlyRadios ? `(${station})` : `${order_number} (${station})`
  return (
    <TableCell
      key={`tableHeaderControl${order_number}(${station})`}
      sx={colWidth ? { minWidth: colWidth } : {}}
    >
      <Typography>{controlString}</Typography>
    </TableCell>
  )
}
