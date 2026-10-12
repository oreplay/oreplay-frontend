import ToolbarIcon from "../../../../../../components/icons/ToolbarIcon.tsx"

/**
 * Icon for the time behind the leader: the flat line of the leader on top and the line of a runner
 * falling away below it, as the gap grows control after control.
 */
export default function BehindLeaderIcon() {
  return (
    <ToolbarIcon>
      <path d="M4 5.5h16" strokeWidth="1.5" />
      <path d="M4 5.5l5.5 4 5 1.5L20 18.5" strokeWidth="2.5" />
    </ToolbarIcon>
  )
}
