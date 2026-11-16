import { ReactElement } from "react"

export const SEGMENTED_CONTROL_GAP = "0.25rem"
export const SEGMENTED_CONTROL_MODE = { Radio: "radio", Tabs: "tabs" } as const
export type SegmentedControlMode =
  (typeof SEGMENTED_CONTROL_MODE)[keyof typeof SEGMENTED_CONTROL_MODE]
export const SEGMENTED_CONTROL_PADDING = "0.25rem"

/**
 * One choice of a segmented control.
 *
 * `icon` is shown before the label; leave it out for a label-only choice. `shortLabelKey` is the
 * translation key of a shorter label to show on small screens instead of `labelKey`; leave it out
 * when the label is short enough everywhere.
 */
export type SegmentedControlOption<Key extends string> = {
  icon?: ReactElement
  key: Key
  labelKey: string
  shortLabelKey?: string
}

/**
 * ARIA attributes of a choice, which depend on whether the control switches tab panels or picks a
 * value.
 *
 * @param mode `tabs` when every choice shows its own panel, `radio` when it picks a value.
 * @param isSelected Whether the choice is the one currently picked.
 * @param panelId Id of the panel the choice shows; only used in `tabs` mode.
 * @returns The role and state attributes to spread on the choice's button.
 */
export function segmentedControlOptionAria(
  mode: SegmentedControlMode,
  isSelected: boolean,
  panelId?: string,
) {
  if (mode === SEGMENTED_CONTROL_MODE.Tabs) {
    return { role: "tab", "aria-selected": isSelected, "aria-controls": panelId } as const
  }
  return { role: "radio", "aria-checked": isSelected } as const
}

/**
 * Element id of an option of a segmented control, used to move the keyboard focus to it.
 *
 * @param controlId Id that is unique to the control on the page.
 * @param optionKey Key of the option inside the control.
 * @returns An id that no other option on the page shares.
 */
export function segmentedControlOptionId(controlId: string, optionKey: string): string {
  return `${controlId}-option-${optionKey}`
}

/**
 * ARIA role of the element that groups the choices.
 *
 * @param mode `tabs` when every choice shows its own panel, `radio` when it picks a value.
 * @returns `tablist` or `radiogroup`.
 */
export function segmentedControlRole(mode: SegmentedControlMode) {
  return mode === SEGMENTED_CONTROL_MODE.Tabs ? "tablist" : "radiogroup"
}

/**
 * Inline style of the raised thumb that sits behind the selected choice and slides between choices.
 * Every choice takes the same share of the track, so the thumb is one share wide and moves by its
 * own width plus the gap for every choice before the selected one. Purely CSS lengths, so it needs
 * no measuring and follows the control when it is resized.
 *
 * @param selectedIndex Position of the selected choice; a negative value means nothing is selected.
 * @param optionCount How many choices the control offers; zero or less hides the thumb.
 * @returns The insets, width, offset and visibility to put on the thumb element.
 */
export function segmentedControlThumbStyle(selectedIndex: number, optionCount: number) {
  const isHidden = selectedIndex < 0 || optionCount <= 0
  const visibleIndex = Math.max(selectedIndex, 0)
  const count = Math.max(optionCount, 1)
  const totalGaps = `${count - 1} * ${SEGMENTED_CONTROL_GAP}`

  return {
    bottom: SEGMENTED_CONTROL_PADDING,
    left: SEGMENTED_CONTROL_PADDING,
    opacity: isHidden ? 0 : 1,
    top: SEGMENTED_CONTROL_PADDING,
    transform: `translateX(calc(${visibleIndex} * (100% + ${SEGMENTED_CONTROL_GAP})))`,
    width: `calc((100% - 2 * ${SEGMENTED_CONTROL_PADDING} - ${totalGaps}) / ${count})`,
  } as const
}
