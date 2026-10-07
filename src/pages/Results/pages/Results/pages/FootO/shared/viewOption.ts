import { ReactElement } from "react"

export type ViewOption<View extends string> = {
  icon: ReactElement
  key: View
  labelKey: string
}
