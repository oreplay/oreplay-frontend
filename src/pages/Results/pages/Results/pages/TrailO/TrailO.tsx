import TrailOExternalResults from "./components/TrailOExternalResults.tsx"
import TrailOMissingExternalResults from "./components/TrailOMissingExternalResults.tsx"

interface TrailOProps {
  externalUrl: string | null
}

/**
 * Results of a Trail-O stage. They are computed and published outside O-Replay (TOP or Jaruori), so
 * the stage only links to them.
 *
 * @param props.externalUrl Where the results are published; `null` while the organiser has
 * not set it yet, which asks the visitor to contact the organiser.
 */
export default function TrailO(props: TrailOProps) {
  if (!props.externalUrl) {
    return <TrailOMissingExternalResults />
  }

  return <TrailOExternalResults url={props.externalUrl} />
}
