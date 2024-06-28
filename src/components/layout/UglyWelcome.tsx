import {
  Box,
  Container,
} from "@mui/material";
import DirectionsRun from "@mui/icons-material/DirectionsRun";
import PrimaryButton from "../common/PrimaryButton";

export default function UglyWelcome() {

  return (
    <Container>
      <Box sx={{m: "50px"}}>
        <h1>
          Welcome to O-Replay
        </h1>
        <img src="/logo.svg" width="124px"></img>
        <Box sx={{mt: "30px"}}>
          The timing system (still in version pre-alfa).
        </Box>
        <Box sx={{mt: "10px"}}>
          <PrimaryButton
            text="Go to Competitions"
            url="/competitions" // TODO need to fix this navigation (should not have reload)
            icon={<DirectionsRun />}
          />
        </Box>
      </Box>
    </Container>
  )
}