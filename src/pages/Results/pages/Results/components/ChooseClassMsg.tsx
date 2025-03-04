import { Box, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

export default function ChooseClassMsg() {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "70%",
      }}
    >
      <Typography sx={{ fontSize: "20px" }}>{t("ResultsStage.ChooseClass")}</Typography>
    </Box>
  )
}
