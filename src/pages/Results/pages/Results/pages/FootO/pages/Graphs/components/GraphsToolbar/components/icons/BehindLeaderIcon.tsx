import ToolbarIcon from "../../../../../../components/icons/ToolbarIcon.tsx"

/**
 * Icon for the time behind the leader: the flat line of the leader on top, ending in the crown the
 * leader wears, and the line of a runner falling away below it as the gap grows.
 */
export default function BehindLeaderIcon() {
  return (
    <ToolbarIcon>
      <path d="M3 9.5h9" strokeWidth="1.5" />
      <path d="M14 5l2 2 2-3.5L20 7l2-2-.75 5h-6.5z" strokeWidth="1.5" />
      <path d="M3 9.5l5 4.5 4.5 1.5 6 5" strokeWidth="2.5" />
    </ToolbarIcon>
  )
}
