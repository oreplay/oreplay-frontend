import { Box, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import PersonOffIcon from "@mui/icons-material/PersonOff"

export default function NoDataInStageMsg() {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "70%",
      }}
    >
      <PersonOffIcon sx={{ fontSize: 100 }} />
      <Typography sx={{ fontSize: "20px" }}>{t("ResultsStage.NoData")}</Typography>
    </Box>
  )
}
