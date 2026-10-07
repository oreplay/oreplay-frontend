import { Box, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import SplitsTableHeaderCell from "./SplitsTableHeaderCell.tsx"

const HORIZONTAL_PADDING = "8px"

type CourseControlTableHeaderProps = {
  isWidthSizer?: boolean
  onlyRadios?: boolean
  order_number?: number | null
  station?: number | string | null
}

export default function CourseControlTableHeader({
  isWidthSizer,
  onlyRadios,
  order_number,
  station,
}: CourseControlTableHeaderProps) {
  const { t } = useTranslation()

  if (station === "Finish" || order_number === Infinity) {
    return (
      <SplitsTableHeaderCell horizontalPadding={HORIZONTAL_PADDING} isWidthSizer={isWidthSizer}>
        <Typography>{t("ResultsStage.VirtualTicket.FinishControl")}</Typography>
      </SplitsTableHeaderCell>
    )
  }

  return (
    <SplitsTableHeaderCell horizontalPadding={HORIZONTAL_PADDING} isWidthSizer={isWidthSizer}>
      {onlyRadios ? (
        <Typography>{`(${station})`}</Typography>
      ) : (
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: "2px",
            fontSize: "1rem",
          }}
        >
          <Typography>{order_number}</Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "#8D8D8D" }}>{`(${station})`}</Typography>
        </Box>
      )}
    </SplitsTableHeaderCell>
  )
}
