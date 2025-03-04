import { Typography } from "@mui/material"

interface RunnerSicardProps {
  runner: { sicard: bigint | null }
}

const RunnerSicard: React.FC<RunnerSicardProps> = ({ runner }) => {
  if (!runner.sicard) return null // Don't render if sicard is null

  return (
    <Typography sx={{ color: "text.secondary", fontSize: "small" }}>
      {runner.sicard.toString()}
    </Typography>
  )
}

export default RunnerSicard
