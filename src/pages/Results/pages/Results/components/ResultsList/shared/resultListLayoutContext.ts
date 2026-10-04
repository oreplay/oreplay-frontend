import { createContext } from "react"

export interface ResultListLayout {
  height: number
  width: number
}

export const ResultListLayoutContext = createContext<ResultListLayout>({ height: 0, width: 0 })
