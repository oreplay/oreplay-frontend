import { useMemo } from "react"
import { useSelectedMenu } from "../../../shared/hooks.ts"
import { ResultTabOption } from "./resultTabs.ts"

export function useResultTabs(defaultMenu: number, options: readonly ResultTabOption[]) {
  const optionKeys = useMemo(() => options.map((option) => option.key), [options])
  const [selectedMenu, handleMenuChange] = useSelectedMenu(defaultMenu, optionKeys)
  return { handleMenuChange, selectedMenu }
}
