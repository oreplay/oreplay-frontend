import { ReactElement } from "react"

/**
 * One choice of a view selector.
 *
 * `shortLabelKey` is the translation key of a shorter label to show on small screens instead of
 * `labelKey`; leave it out when the label is short enough everywhere.
 */
export type ViewOption<View extends string> = {
  icon: ReactElement
  key: View
  labelKey: string
  shortLabelKey?: string
}
