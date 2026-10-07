import { ReactNode } from "react"

interface ToolbarIconProps {
  children: ReactNode
}

/**
 * Frame shared by the splits toolbar icons, so they all have the same size, line weight and
 * colour. The icon is decorative: the button around it carries the label.
 *
 * @param props.children The SVG shapes of the icon, drawn on a 24 by 24 grid.
 */
export default function ToolbarIcon({ children }: ToolbarIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="splits-toolbar-icon h-5 w-5 shrink-0"
    >
      {children}
    </svg>
  )
}
