import {
  Box,
  Container, Link,
} from "@mui/material";
import DirectionsRun from "@mui/icons-material/DirectionsRun";
import {useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import {Trans, useTranslation} from "react-i18next";

export default function Home() {
  const navigate = useNavigate();
  const {t} = useTranslation();

  return (
    <Container>
      <Box sx={{m: "50px"}}>
        <h1>
          {t('Home.WelcomeMsg')}
        </h1>
        <img alt='O-Replay logo' src="/logo.svg" width="124px"></img>
        <Box sx={{mt: "30px"}}>
          {t('Home.ProjectDescription')} v0.1.13
        </Box>
        <Box sx={{mt: "10px"}}>
          <Button
            variant="contained"
            endIcon={<DirectionsRun />} // Use the provided icon or default to DirectionsRun
            onClick={()=>navigate('/competitions')}
            sx={{
              color: '#ffffff',
              fontSize: '1.1rem',
              padding: '12px 24px',
              width: { xs: '100%', sm: '100%', md: '100%', lg: 'auto' }, // Full-width on xs, sm, and md, auto on lg and above
              minWidth: '200px',
            }}
          >
            {t('Home.Go to competitions')}
          </Button>
        </Box>
        <Box sx={{mt: "30px"}}>
          <Trans i18nKey="Home.DevelopersHelpMessage">
            We are proud of being an open source project. Please checkout out GitHub page <Link href="https://github.com/oreplay" target="_blank">github.com/oreplay</Link> to find guidance on developing with O-Replay or contributing. Also, checkout our <Link href="https://www.oreplay.es/api/v1/openapi/" target="_blank">public API documentation</Link>.
          </Trans>
        </Box>
      </Box>
    </Container>
  )
}