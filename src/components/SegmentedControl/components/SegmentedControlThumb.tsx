import {
  SEGMENTED_CONTROL_PADDING,
  segmentedControlThumbStyle,
} from "../shared/segmentedControl.ts"

interface SegmentedControlThumbProps {
  optionCount: number
  selectedIndex: number
}

/**
 * Raised white pill behind the selected choice of a segmented control. It slides to the newly
 * selected choice with an ease-out transition, and jumps there at once for users who prefer
 * reduced motion. Purely decorative, so it is hidden from assistive technology.
 *
 * @param props.optionCount How many choices the control offers.
 * @param props.selectedIndex Position of the selected choice; negative when nothing is selected.
 */
export default function SegmentedControlThumb({
  optionCount,
  selectedIndex,
}: SegmentedControlThumbProps) {
  const style = {
    ...segmentedControlThumbStyle(selectedIndex, optionCount),
    bottom: SEGMENTED_CONTROL_PADDING,
    left: SEGMENTED_CONTROL_PADDING,
    top: SEGMENTED_CONTROL_PADDING,
  }

  return (
    <span
      aria-hidden="true"
      style={style}
      className="segmented-control-thumb pointer-events-none absolute rounded-md bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12)] transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none"
    />
  )
}
