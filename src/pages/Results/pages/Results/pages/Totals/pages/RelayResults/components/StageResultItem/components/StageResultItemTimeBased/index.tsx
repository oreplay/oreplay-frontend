import TotalsStageTime from "../TotalsStageTime"

interface StageResultItemTimeBasedProps {
  time: number
  status: string
  position: number
  contributory?: boolean
}

export default function StageResultItemTimeBased({
  time,
  status,
  position,
}: StageResultItemTimeBasedProps) {
  return <TotalsStageTime displayStatus time={time} status={status} position={position} />
}
