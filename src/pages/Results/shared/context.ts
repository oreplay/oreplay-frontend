import { createContext } from "react"
import { DateTime } from "luxon"

export const NowContext = createContext<DateTime>(DateTime.now())
