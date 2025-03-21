import { Box, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

export default function VirtualTicketNoDownloadMsg() {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        marginY: "2em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography sx={{ color: "text.secondary", fontSize: "small" }}>
        {t("ResultsStage.VirtualTicket.NoDownloadMsg")}
      </Typography>
    </Box>
  )
}
