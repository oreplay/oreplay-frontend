import { RESULT_STATUS } from "../../../../../../../../../../../../shared/constants.ts"
import { Typography } from "@mui/material"
import Status from "../../../../../../../../../../components/Status.tsx"
import { parseResultStatus } from "../../../../../../../../../../../../shared/sortingFunctions/sortRunners.ts"

interface RacePointsProps {
  points: number | null
  displayStatus?: boolean
  status?: string
  highlight?: boolean
}

export default function RacePoints({
  points,
  displayStatus = false,
  status,
  highlight,
}: RacePointsProps) {
  if (
    points !== null &&
    (!displayStatus || status === RESULT_STATUS.ok || status === RESULT_STATUS.nc)
  ) {
    return (
      <Typography sx={{ color: highlight ? "primary.main" : undefined }} component={"span"}>
        {points}
      </Typography>
    )
  } else if (points && status) {
    return <Status status={parseResultStatus(status)} />
  } else {
    return
  }
}
