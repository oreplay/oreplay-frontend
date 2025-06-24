import { Typography } from "@mui/material"

interface RunnerSicardProps {
  sicard: string | null
}

export default function RunnerSicard({ sicard }: RunnerSicardProps) {
  if (!sicard) return null // Don't render if sicard is null

  return <Typography sx={{ color: "text.secondary", fontSize: "small" }}>{sicard}</Typography>
}
