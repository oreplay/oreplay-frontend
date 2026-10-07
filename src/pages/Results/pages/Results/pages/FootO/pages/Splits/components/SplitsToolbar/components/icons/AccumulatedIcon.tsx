import ToolbarIcon from "./ToolbarIcon.tsx"

/**
 * Icon for the accumulated times: three bars growing from the same start line, because every time
 * is counted from the start of the race.
 */
export default function AccumulatedIcon() {
  return (
    <ToolbarIcon>
      <path d="M4 3.5v17" strokeWidth="1.5" />
      <path d="M4 7h5.5M4 12h10.5M4 17h16" strokeWidth="2.5" />
    </ToolbarIcon>
  )
}
