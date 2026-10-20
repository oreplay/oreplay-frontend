import ToolbarIcon from "./ToolbarIcon.tsx"

/**
 * Icon for an explanation: the letter "i" inside a circle.
 */
export default function InfoIcon() {
  return (
    <ToolbarIcon>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5" />
      <path d="M12 7.5h.01" strokeWidth="2.5" />
    </ToolbarIcon>
  )
}
