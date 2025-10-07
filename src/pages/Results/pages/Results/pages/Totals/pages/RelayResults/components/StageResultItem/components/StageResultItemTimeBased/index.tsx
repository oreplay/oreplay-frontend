import TotalsStageTime from "../TotalsStageTime"

interface StageResultItemTimeBasedProps {
  time: number
  status: string
  contributory?: boolean
}

export default function StageResultItemTimeBased({ time, status }: StageResultItemTimeBasedProps) {
  return <TotalsStageTime displayStatus time={time} status={status} />
}
