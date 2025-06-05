import { useTranslation } from "react-i18next"
import { Container, createTheme, Theme, ThemeProvider, Typography } from "@mui/material"

export default function PrivacyPolicy() {
  const { t } = useTranslation("privacy-policy")

  const privacyPolicyTheme = (theme: Theme) =>
    createTheme({
      ...theme,
      typography: {
        h1: {
          fontSize: 36,
          fontWeight: 500,
          marginBottom: "1rem",
        },
        h2: {
          marginTop: "48px",
          fontWeight: 500,
          marginBottom: "16px",
          fontSize: 26,
        },
        h3: {
          fontWeight: 500,
          marginBottom: "12px",
          fontSize: 20,
        },
        h4: {
          fontWeight: 500,
          marginBottom: "10px",
          fontSize: 20,
        },
        body1: {
          marginTop: "8px",
          marginBottom: "8px",
        },
        subtitle1: {
          fontWeight: "bold",
          color: "secondary.main",
        },
      },
    })

  return (
    <ThemeProvider theme={privacyPolicyTheme}>
      <Container sx={{ marginBottom: "20px" }}>
        <Typography variant="h1">{t("header")}</Typography>
        <Typography>{t("p1")}</Typography>
      </Container>
    </ThemeProvider>
  )
}
