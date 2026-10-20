/**
 * Stopwatch, standing for split times. Decorative.
 */
export default function StopwatchIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="13" r="8" />
      <polyline points="12 9 12 13 14.5 15" />
      <line x1="10" y1="2" x2="14" y2="2" />
    </svg>
  )
}
