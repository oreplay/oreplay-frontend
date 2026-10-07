import { useContext } from "react"
import { SplitsTableContentContext } from "./splitsTableContentContext.ts"

export default function useSplitsTableContent() {
  return useContext(SplitsTableContentContext)
}
