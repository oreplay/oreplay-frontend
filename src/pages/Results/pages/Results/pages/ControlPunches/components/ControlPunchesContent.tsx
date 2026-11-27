import RefreshButton from "../../../components/RefreshButton.tsx"
import { useControlPunches } from "../shared/useControlPunches.ts"
import ControlPunchesBackButton from "./ControlPunchesBackButton.tsx"
import ControlPunchesHeading from "./ControlPunchesHeading.tsx"
import ControlPunchesList from "./ControlPunchesList.tsx"

interface ControlPunchesContentProps {
  eventId: string
  stageId: string
  station: number
}

/**
 * Body of the punches screen: the control's title, with a way back to the stage results when the
 * page was opened directly and a button to reload, and the latest page of punches.
 * @param props.eventId Identifier of the event.
 * @param props.stageId Identifier of the stage.
 * @param props.station Code of the control.
 */
export default function ControlPunchesContent({
  eventId,
  stageId,
  station,
}: ControlPunchesContentProps) {
  const punchesQuery = useControlPunches(eventId, stageId, station)

  return (
    <section className="flex flex-col p-4">
      <div className="flex flex-row items-center justify-between pb-1">
        <div className="flex flex-row items-center">
          <ControlPunchesBackButton eventId={eventId} stageId={stageId} />
          <ControlPunchesHeading station={station} />
        </div>
        <RefreshButton isFetching={punchesQuery.isFetching} onRefresh={punchesQuery.refetch} />
      </div>
      <ControlPunchesList punchesQuery={punchesQuery} />
    </section>
  )
}
