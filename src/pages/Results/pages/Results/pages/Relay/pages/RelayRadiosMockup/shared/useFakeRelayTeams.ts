import { AxiosError } from "axios"
import { DateTime } from "luxon"
import { useQuery } from "react-query"
import { RunnerModel } from "../../../../../../../../../shared/EntityTypes.ts"
import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { processRunnerData } from "../../../../../../../components/VirtualTicket/shared/virtualTicketFunctions.ts"
import { buildFakeRelayTeams, FAKE_RELAY_CLASS } from "./fakeRelayTeams.ts"

const FAKE_RELAY_QUERY_KEY = "fake-relay-teams"

/**
 * Teams of the fake relay, processed like the relay results of a real class, in the query shape
 * the relay tabs expect. The race is drawn at the moment the page opens.
 *
 * @returns The query of the processed fake teams.
 */
export function useFakeRelayTeams() {
  return useQuery<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>(
    FAKE_RELAY_QUERY_KEY,
    () =>
      Promise.resolve(processRunnerData(buildFakeRelayTeams(DateTime.now()), [FAKE_RELAY_CLASS])),
    { staleTime: Infinity },
  )
}
