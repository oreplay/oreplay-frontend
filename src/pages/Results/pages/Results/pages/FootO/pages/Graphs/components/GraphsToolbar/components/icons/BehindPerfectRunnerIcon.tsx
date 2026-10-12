import ToolbarIcon from "../../../../../../components/icons/ToolbarIcon.tsx"

/**
 * Icon for the time behind the perfect runner: the same falling line as the time behind the leader,
 * but under a reference cut into pieces and ending in a star, because the perfect runner is put
 * together from the best time of every leg.
 */
export default function BehindPerfectRunnerIcon() {
  return (
    <ToolbarIcon>
      <path d="M3 9.5h2M7 9.5h2M11 9.5h1.5" strokeWidth="1.5" />
      <path
        d="M18.0 2.3 L19.12 5.06 L22.09 5.27 L19.81 7.19 L20.53 10.08 L18.0 8.5 L15.47 10.08 L16.19 7.19 L13.91 5.27 L16.88 5.06z"
        strokeWidth="1.5"
      />
      <path d="M3 9.5l5 4.5 4.5 1.5 6 5" strokeWidth="2.5" />
    </ToolbarIcon>
  )
}
