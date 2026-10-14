import NoDataInStageMsg from "../../components/NoDataInStageMsg.tsx"
import TrailOExternalResults from "./components/TrailOExternalResults.tsx"

interface TrailOProps {
  externalResultsUrl: string | null
}

/**
 * Results of a Trail-O stage. They are computed and published outside O-Replay (TOP or Jaruori), so
 * the stage only links to them.
 *
 * @param props.externalResultsUrl Where the results are published; `null` while the organiser has
 * not set it yet, which shows that no data is available.
 */
export default function TrailO(props: TrailOProps) {
  if (!props.externalResultsUrl) {
    return <NoDataInStageMsg />
  }

  return <TrailOExternalResults url={props.externalResultsUrl} />
}
