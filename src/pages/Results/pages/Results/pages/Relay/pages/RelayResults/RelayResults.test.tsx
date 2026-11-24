import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { UseQueryResult } from "react-query"
import { AxiosError } from "axios"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import { baseLegFixture, baseRelayRunnerFixture } from "../../shared/relayFixtures.ts"
import RelayResults from "./RelayResults.tsx"

vi.mock("./components/RelayResultsList.tsx", () => ({
  default: (props: { teams: ProcessedRunnerModel[] }) => (
    <ul>
      {props.teams.map((team) => (
        <li key={team.id}>{team.full_name}</li>
      ))}
    </ul>
  ),
}))

const START_TIME = "2025-10-26T09:00:00.000+00:00"
const TEAM_NAME = "Aligots Aligot 9"

/**
 * Builds a settled query holding the given teams, as react-query returns it once loaded.
 *
 * @param teams The teams the query resolved with.
 * @returns The query result.
 */
function buildQuery(
  teams: ProcessedRunnerModel[],
): UseQueryResult<ProcessedRunnerModel[], AxiosError<RunnerModel[]>> {
  return {
    data: teams,
    isLoading: false,
    isError: false,
    isRefetchError: false,
  } as UseQueryResult<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>
}

/**
 * Renders the relay results of a class holding the given teams.
 *
 * @param teams The teams of the class.
 */
function renderResults(teams: ProcessedRunnerModel[]): void {
  render(
    <RelayResults
      runnersQuery={buildQuery(teams)}
      activeItem={baseRelayRunnerFixture.class}
      isClass
      setClassClubId={vi.fn()}
    />,
  )
}

describe("RelayResults", () => {
  it("asks for relay results when the teams raced without leg runners", () => {
    const individual = {
      ...baseRelayRunnerFixture,
      full_name: TEAM_NAME,
      stage: { ...baseRelayRunnerFixture.stage, start_time: START_TIME },
      runners: [],
    }

    renderResults([individual])

    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(screen.queryByText(TEAM_NAME)).not.toBeInTheDocument()
  })

  it("lists the teams of a relay", () => {
    const team = { ...baseRelayRunnerFixture, full_name: TEAM_NAME, runners: [baseLegFixture] }

    renderResults([team])

    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    expect(screen.getByText(TEAM_NAME)).toBeInTheDocument()
  })
})
