import ToolbarIcon from "../../../../../../components/icons/ToolbarIcon.tsx"

/**
 * Icon for the time behind the perfect runner: the same falling line as the time behind the leader,
 * but under a reference cut into pieces, because the perfect runner is put together from the best
 * time of every leg.
 */
export default function BehindPerfectRunnerIcon() {
  return (
    <ToolbarIcon>
      <path d="M4 5.5h3.5M10.25 5.5h3.5M16.5 5.5H20" strokeWidth="1.5" />
      <path d="M4 5.5l5.5 4 5 1.5L20 18.5" strokeWidth="2.5" />
    </ToolbarIcon>
  )
}
