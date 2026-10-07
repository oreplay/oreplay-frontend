import ToolbarIcon from "./ToolbarIcon.tsx"

/**
 * Icon for the split times: three bars stepping away from the start line, each one beginning where
 * the previous one ends, because every leg is timed on its own.
 */
export default function SplitsIcon() {
  return (
    <ToolbarIcon>
      <path d="M4 3.5v17" strokeWidth="1.5" />
      <path d="M4 7h5.5M9.5 12h5M14.5 17H20" strokeWidth="2.5" />
    </ToolbarIcon>
  )
}
