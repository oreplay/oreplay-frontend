import { Box, TableCell, Typography } from "@mui/material"
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
  const cellStyle = {
    padding: "10px",
    ...(colWidth ? { minWidth: colWidth } : {}),
  }

  if (station === "Finish" || order_number === Infinity) {
    return (
      <TableCell key={"Finish Control"} sx={cellStyle}>
        <Typography>{t("ResultsStage.VirtualTicket.FinishControl")}</Typography>
      </TableCell>
    )
  }

  return (
    <TableCell key={`tableHeaderControl${order_number}(${station})`} sx={cellStyle}>
      {onlyRadios ? (
        <Typography>{`(${station})`}</Typography>
      ) : (
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: "2px",
            px: "10px",
            py: "4px",
            fontSize: "1rem",
          }}
        >
          <Typography>{order_number}</Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "#8D8D8D" }}>{`(${station})`}</Typography>
        </Box>
      )}
    </TableCell>
  )
}
