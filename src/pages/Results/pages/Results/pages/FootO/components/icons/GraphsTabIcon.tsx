const ICON_SIZE_PX = 24

/**
 * Icon of the graphs tab of the results: a line falling between the two axes of a chart, as
 * the time behind grows. It is decorative, because the tab around it carries the label.
 */
export default function GraphsTabIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={ICON_SIZE_PX}
      height={ICON_SIZE_PX}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="graphs-tab-icon shrink-0"
    >
      <path d="M4 4v16h16" />
      <path d="M7.5 6l4 4 4 1.5L20 16.5" />
    </svg>
  )
}
