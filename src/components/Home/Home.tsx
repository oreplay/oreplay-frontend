import {
  Box,
  Container,
} from "@mui/material";
import DirectionsRun from "@mui/icons-material/DirectionsRun";
import {useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import {useTranslation} from "react-i18next";

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
          {t('Home.ProjectDescription')} v0.1.6
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
      </Box>
    </Container>
  )
}