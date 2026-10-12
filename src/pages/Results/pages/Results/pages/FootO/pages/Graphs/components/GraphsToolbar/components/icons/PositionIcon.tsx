import ToolbarIcon from "../../../../../../components/icons/ToolbarIcon.tsx"

/**
 * Icon for the position evolution: two runners whose lines cross as one overtakes the other.
 */
export default function PositionIcon() {
  return (
    <ToolbarIcon>
      <path d="M4 7h4.5l7 10H20" strokeWidth="2.5" />
      <path d="M4 17h4.5l7-10H20" strokeWidth="1.5" />
    </ToolbarIcon>
  )
}
