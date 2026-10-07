import { createContext } from "react"
import { TimeLossResults } from "../../../../../shared/timeLossAnalysis.ts"

export type SplitsTableContent = {
  showCumulative: boolean
  showTimeLoss: boolean
  timeLossResults: TimeLossResults | null
}

export const SplitsTableContentContext = createContext<SplitsTableContent>({
  showCumulative: false,
  showTimeLoss: false,
  timeLossResults: null,
})
