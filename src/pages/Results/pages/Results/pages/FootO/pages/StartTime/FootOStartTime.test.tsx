import { render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { RESULT_STATUS } from "../../../../../../shared/constants.ts"
import FootOStartTime from "./FootOStartTime.tsx"

const SKELETON_TEST_ID = "results-skeleton"
const RUNNER_NAME = "Ada Lovelace"

type Props = Parameters<typeof FootOStartTime>[0]

vi.mock("../../../../components/ResultsList/ResultListSkeleton.tsx", () => ({
  default: () => <div data-testid="results-skeleton" />,
}))

interface QueryState {
  data?: ProcessedRunnerModel[]
  isFetching: boolean
  isLoading: boolean
}

/**
 * Builds a runner with a start time, the only data the start list shows.
 * @returns A runner that has not started yet.
 */
function buildRunner(): ProcessedRunnerModel {
  return {
    id: "runner",
    full_name: RUNNER_NAME,
    sicard: "123",
    club: null,
    class: { id: "class", short_name: "M21" },
    stage: { start_time: "2026-01-01T10:00:00.000+00:00", status_code: RESULT_STATUS.ok },
  } as unknown as ProcessedRunnerModel
}

/**
 * Renders the start list for a class with the given query state.
 * @param queryState The react-query flags and data the list receives.
 */
function renderStartTimes(queryState: QueryState) {
  const runnersQuery = { isError: false, ...queryState } as Props["runnersQuery"]
  render(
    <FootOStartTime
      activeItem={{ id: "class" } as Props["activeItem"]}
      isClass
      runnersQuery={runnersQuery}
    />,
  )
}

describe("FootOStartTime", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe = vi.fn()
        unobserve = vi.fn()
        disconnect = vi.fn()
      },
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("shows the skeleton on a cold load", () => {
    renderStartTimes({ isFetching: true, isLoading: true })

    expect(screen.getByTestId(SKELETON_TEST_ID)).toBeInTheDocument()
  })

  it("keeps the start list on screen while it is refreshed", () => {
    renderStartTimes({ data: [buildRunner()], isFetching: true, isLoading: false })

    expect(screen.getByText(RUNNER_NAME)).toBeInTheDocument()
    expect(screen.queryByTestId(SKELETON_TEST_ID)).not.toBeInTheDocument()
  })
})
