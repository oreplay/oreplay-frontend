// Outlined field styling shared by the form controls, matching the host's MUI
// outlined inputs: white background, 1px border, 4px radius (`rounded`), and a
// primary-coloured focus outline. The `ring` (not a thicker border) avoids the
// 1px layout shift a border-width change would cause on focus.
const FIELD_BASE = "rounded border bg-white px-[14px] py-[16.5px] outline-none focus:ring-1"
const FIELD_IDLE = "border-neutral-300 focus:border-primary focus:ring-primary"
const FIELD_INVALID = "border-red-500 focus:border-red-500 focus:ring-red-500"

/** Field styling for a control; turns the border red while it has an error. */
export function fieldClass(hasError?: boolean): string {
  return [FIELD_BASE, hasError ? FIELD_INVALID : FIELD_IDLE].join(" ")
}

export const FIELD_CLASS = fieldClass(false)
