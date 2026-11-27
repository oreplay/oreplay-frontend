import { Person } from "@mui/icons-material"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import { RESULT_TAB } from "../../../shared/constants.ts"
import { ResultTabOption } from "../../../shared/resultTabs.ts"

/** Tabs of a relay stage: the team results and the runners of each leg. */
export const RELAY_TABS: readonly ResultTabOption[] = [
  { icon: <EmojiEventsIcon />, key: RESULT_TAB.Results, labelKey: "StageHeader.Results" },
  { icon: <Person />, key: RESULT_TAB.Legs, labelKey: "StageHeader.RelayLegs" },
]
