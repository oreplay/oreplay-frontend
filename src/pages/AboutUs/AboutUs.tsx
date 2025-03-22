import { Trans, useTranslation } from "react-i18next"
import { Box, Container, createTheme, Link, Theme, ThemeProvider, Typography } from "@mui/material"
import React from "react"
const VERSION_NUMBER = import.meta.env.VITE_VERSION_NUMBER
const VERSION_TYPE = import.meta.env.VITE_VERSION_TYPE

export default function AboutUs() {
  const { t } = useTranslation("about-us")

  const aboutUsTheme = (theme: Theme) =>
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
      },
    })

  const style = {
    alert: {
      my: "1em",
    },
  }

  return (
    <ThemeProvider theme={aboutUsTheme}>
      <Container>
        <Typography variant={"h1"}>{t("Header")}</Typography>
      </Container>
    </ThemeProvider>
  )
}
