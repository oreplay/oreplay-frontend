import { Trans, useTranslation } from "react-i18next"
import { Box, Container, Link } from "@mui/material"
const VERSION_NUMBER = import.meta.env.VITE_VERSION_NUMBER
const VERSION_TYPE = import.meta.env.VITE_VERSION_TYPE

export default function AboutUs() {
  const { t } = useTranslation()

  return (
    <Container>
      <Box sx={{ m: "50px" }}>
        <h1>{t("AboutUs.WelcomeMsg")}</h1>
        <img alt="O-Replay logo" src="/logo.svg" width="124px"></img>
        <Box sx={{ mt: "30px" }}>
          {t("AboutUs.ProjectDescription")} {`${VERSION_TYPE}) v${VERSION_NUMBER}`}
        </Box>
        <Box sx={{ mt: "30px" }}>
          <Trans i18nKey="AboutUs.DevelopersHelpMessage">
            We are proud of being an open source project. Please checkout out GitHub page{" "}
            <Link href="https://github.com/oreplay" target="_blank">
              github.com/oreplay
            </Link>{" "}
            to find guidance on developing with O-Replay or contributing. Also, checkout our{" "}
            <Link href="https://www.oreplay.es/api/v1/openapi/" target="_blank">
              public API documentation
            </Link>
            .
          </Trans>
        </Box>
      </Box>
    </Container>
  )
}
