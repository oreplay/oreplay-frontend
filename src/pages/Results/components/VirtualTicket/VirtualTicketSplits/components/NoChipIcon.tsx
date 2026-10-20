/**
 * Document struck through by a slash, meaning there is no chip reading. Decorative.
 */
export default function NoChipIcon() {
  return (
    <svg
      aria-hidden="true"
      className="no-chip-icon text-neutral-400"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="9" y1="7" x2="15" y2="7" />
      <line x1="9" y1="11" x2="15" y2="11" />
      <line x1="3" y1="21" x2="21" y2="3" />
    </svg>
  )
}
