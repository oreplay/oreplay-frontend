import RacePoints from "../../../TotalResultItem/components/TotalResultItemPointBasedColumn/components/RacePoints/RacePoints.tsx"
import Box from "@mui/material/Box"
import TotalsStageTime from "../TotalsStageTime/TotalsStageTime.tsx"

interface StageResultItemPointBasedColumn {
  points: number
  time: number
  status: string
  position: number
  contributory?: boolean
}

export default function StageResultItemPointBasedColumn({
  points,
  time,
  status,
  position,
  contributory,
}: StageResultItemPointBasedColumn) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-end",
      }}
    >
      <RacePoints points={points} highlight={contributory} />
      <TotalsStageTime displayStatus time={time} status={status} position={position} />
    </Box>
  )
}
