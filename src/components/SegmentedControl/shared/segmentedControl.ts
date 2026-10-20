import { ReactElement } from "react"

export const SEGMENTED_CONTROL_MODE = { Radio: "radio", Tabs: "tabs" } as const
export type SegmentedControlMode =
  (typeof SEGMENTED_CONTROL_MODE)[keyof typeof SEGMENTED_CONTROL_MODE]

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
