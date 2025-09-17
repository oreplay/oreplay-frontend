import { Typography, Box } from "@mui/material"
import { useTranslation } from "react-i18next"
import LockIcon from "@mui/icons-material/Lock"

export default function PrivateEventPage() {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        gap: "1em",
        marginX: "2em",
        textAlign: "center",
      }}
    >
      <LockIcon sx={{ fontSize: 100 }} />
      <Typography variant="h4" component="h1" gutterBottom>
        {t("PrivateEventPage.Header")}
      </Typography>
      <Typography component={"p"}>{t("PrivateEventPage.Message")}</Typography>
    </Box>
  )
}
