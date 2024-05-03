import {
  Box,
} from "@mui/material";

export default function UglyWelcome() {

  return (
    <Box sx={{m: "50px"}}>
      <h1>
        Welcome to O-Replay
      </h1>
      <img src="/logo.svg" width="124px"></img>
      <Box sx={{mt: "30px"}}>
        The timing system (still in version pre-alfa).
      </Box>
      <Box sx={{mt: "10px"}}>
        Open the menu to check the existing events.
      </Box>
    </Box>
  )
}