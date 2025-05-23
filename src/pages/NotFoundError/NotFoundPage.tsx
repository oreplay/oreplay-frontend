import { Typography, Button, Box } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory"

const NotFoundPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleHomeClick = () => {
    void navigate("/")
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        textAlign: "center",
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        {t("404Page.Header")}
      </Typography>
      <Typography variant="h5" paragraph>
        {t("404Page.Message")}
      </Typography>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleHomeClick}
        startIcon={<ChangeHistoryIcon />}
        sx={{
          textTransform: "none",
        }}
      >
        {t("404Page.ButtonMessage")}
      </Button>
    </Box>
  )
}

export default NotFoundPage
