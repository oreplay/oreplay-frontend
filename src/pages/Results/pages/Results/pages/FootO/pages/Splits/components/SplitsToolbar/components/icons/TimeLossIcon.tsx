import ToolbarIcon from "./ToolbarIcon.tsx"

/**
 * Icon for the time loss analysis: a stopwatch with a slice of its dial filled in, the part of the
 * time that was lost.
 */
export default function TimeLossIcon() {
  return (
    <ToolbarIcon>
      <path d="M9.5 2h5M12 2v3" />
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M12 13.5V6a7.5 7.5 0 0 1 6.5 11.25Z" fill="currentColor" stroke="none" />
    </ToolbarIcon>
  )
}
