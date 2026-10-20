const CROSS_SIZE = "0.6em"
const CROSS_STROKE_WIDTH = 2.5
const CROSS_BASELINE_OFFSET = "0.05em"

interface NotOkCrossProps {
  label: string
}

/**
 * Small bold cross that marks a result whose status is known to be not ok. It sits inline in the
 * text flow, sized and lifted to the middle of the digits, so it lines up with positions in other
 * rows and keeps the row's line height.
 * @param props.label Accessible name read by screen readers, e.g. the translated status ("MP").
 */
export default function NotOkCross({ label }: NotOkCrossProps) {
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 10 10"
      width={CROSS_SIZE}
      height={CROSS_SIZE}
      fill="none"
      stroke="currentColor"
      strokeWidth={CROSS_STROKE_WIDTH}
      strokeLinecap="round"
      style={{ display: "inline-block", verticalAlign: CROSS_BASELINE_OFFSET }}
    >
      <path d="M2 2L8 8M8 2L2 8" />
    </svg>
  )
}
