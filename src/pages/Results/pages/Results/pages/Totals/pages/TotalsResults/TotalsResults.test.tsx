import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { UseQueryResult } from "react-query"
import { AxiosError } from "axios"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { RunnerModel } from "../../../../../../../../shared/EntityTypes.ts"
import { baseTotalsRunnerFixture } from "./shared/totalsFixtures.ts"
import TotalsResults from "./TotalsResults.tsx"

vi.mock("../../../../components/RunnerSorter/RunnerSorter.tsx", () => ({
  default: (props: { runnerList: ProcessedRunnerModel[] }) => (
    <ul>
      {props.runnerList.map((runner) => (
        <li key={runner.id}>{runner.full_name}</li>
      ))}
    </ul>
  ),
}))

const RUNNER_NAME = "Aligot Aligotez"

/**
 * Builds a settled query holding the given runners, as react-query returns it once loaded.
 *
 * @param runners The runners the query resolved with.
 * @returns The query result.
 */
function buildQuery(
  runners: ProcessedRunnerModel[],
): UseQueryResult<ProcessedRunnerModel[], AxiosError<RunnerModel[]>> {
  return {
    data: runners,
    isLoading: false,
    isError: false,
    isRefetchError: false,
  } as UseQueryResult<ProcessedRunnerModel[], AxiosError<RunnerModel[]>>
}

/**
 * Renders the totals results of a class holding the given runners.
 *
 * @param runners The runners of the class.
 */
function renderResults(runners: ProcessedRunnerModel[]): void {
  render(
    <TotalsResults
      runnersQuery={buildQuery(runners)}
      activeItem={baseTotalsRunnerFixture.class}
      isClass
    />,
  )
}

describe("TotalsResults", () => {
  it("asks for totals results when the runners have no overall result", () => {
    renderResults([{ ...baseTotalsRunnerFixture, full_name: RUNNER_NAME, overalls: null }])

    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(screen.queryByText(RUNNER_NAME)).not.toBeInTheDocument()
  })

  it("lists the runners of a totals stage", () => {
    renderResults([{ ...baseTotalsRunnerFixture, full_name: RUNNER_NAME }])

    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    expect(screen.getByText(RUNNER_NAME)).toBeInTheDocument()
  })
})
