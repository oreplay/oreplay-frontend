import { Box } from "@mui/material"
import "../../../../../../../../styles/tokens.css"
import "../../../../../../../../styles/tailwind.css"
import ResultTabsBar from "../../../../components/ResultTabsBar/ResultTabsBar.tsx"
import ResultTabsPanel from "../../../../components/ResultTabsPanel.tsx"
import { useResultTabs } from "../../../../shared/useResultTabs.ts"
import { RELAY_TABS } from "../../shared/relayTabs.tsx"
import RelayLegs from "../RelayLegs/RelayLegs.tsx"
import RelayResults from "../RelayResults/RelayResults.tsx"
import { FAKE_RELAY_CLASS } from "./shared/fakeRelayTeams.ts"
import { useFakeRelayTeams } from "./shared/useFakeRelayTeams.ts"

const RESULTS_TAB_INDEX = 0

/**
 * Keeps the fake relay on its only class when the virtual ticket asks to show another class or
 * club.
 */
function stayOnFakeClass() {}

/**
 * Draft of a relay stage with radio controls, drawn from a fake relay instead of the API: the
 * team results with the online course of each running leg, and the runners of each leg.
 */
export default function RelayRadiosMockup() {
  const teamsQuery = useFakeRelayTeams()
  const { selectedMenu, handleMenuChange } = useResultTabs(RESULTS_TAB_INDEX, RELAY_TABS)

  return (
    <Box sx={{ px: 2, height: "100%" }}>
      <ResultTabsBar options={RELAY_TABS} selectedMenu={selectedMenu} onChange={handleMenuChange} />
      <ResultTabsPanel options={RELAY_TABS} selectedMenu={selectedMenu}>
        <RelayResults
          runnersQuery={teamsQuery}
          activeItem={FAKE_RELAY_CLASS}
          isClass
          setClassClubId={stayOnFakeClass}
        />
        <RelayLegs runnersQuery={teamsQuery} activeItem={FAKE_RELAY_CLASS} isClass />
      </ResultTabsPanel>
    </Box>
  )
}
