import { createContext } from "react"
import { HorizontalScrollGroup } from "./createHorizontalScrollGroup.ts"

export const HorizontalScrollGroupContext = createContext<HorizontalScrollGroup | null>(null)
