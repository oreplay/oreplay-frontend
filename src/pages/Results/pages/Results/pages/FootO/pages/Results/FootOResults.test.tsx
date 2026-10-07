import { render, screen } from "@testing-library/react"
import { ComponentProps } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { ProcessedRunnerModel } from "../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { UPLOAD_TYPES } from "../../../../shared/constants.ts"
import FootOResults from "./FootOResults.tsx"
import {
  buildFinishSplit,
  buildOnlineSplit,
  buildRunnerWithOnlineSplits,
} from "./shared/onlineCourse/onlineCourseFixtures.ts"

type FootOResultProps = ComponentProps<typeof FootOResults>

const SKELETON_TEST_ID = "results-skeleton"
const RUNNER_NAME = "Ada Lovelace"
const ACTIVE_CLASS = { id: "class", splits: [] } as unknown as FootOResultProps["activeItem"]

vi.mock("../../components/FootOVirtualTicket/FootOVirtualTicket.tsx", () => ({
  default: () => null,
}))

vi.mock("../../../../components/ResultsList/ResultListSkeleton.tsx", () => ({
  default: () => <div data-testid="results-skeleton" />,
}))

interface QueryState {
  data?: ProcessedRunnerModel[]
  isFetching: boolean
  isLoading: boolean
}

function buildRunner(onlineSplits = [buildOnlineSplit(31, 1, 130), buildFinishSplit(null)]) {
  const runner = buildRunnerWithOnlineSplits({ onlineSplits })
  return {
    ...runner,
    class: { id: "class", short_name: "M21" },
    club: null,
    full_name: RUNNER_NAME,
    stage: {
      ...runner.stage,
      start_time: null,
      time_seconds: 0,
      upload_type: UPLOAD_TYPES.ONLINE_SPLITS,
    },
  } as ProcessedRunnerModel
}

function renderResults(queryState: QueryState) {
  const runnersQuery = { isError: false, ...queryState } as FootOResultProps["runnersQuery"]
  return render(
    <FootOResults
      activeItem={ACTIVE_CLASS}
      isClass
      runnersQuery={runnersQuery}
      setClassClubId={vi.fn()}
    />,
  ).container
}

describe("FootOResults", () => {
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
    renderResults({ isFetching: true, isLoading: true })

    expect(screen.getByTestId(SKELETON_TEST_ID)).toBeInTheDocument()
  })

  it("keeps the rows on screen while the results are refreshed", () => {
    renderResults({ data: [buildRunner()], isFetching: true, isLoading: false })

    expect(screen.getByText(RUNNER_NAME)).toBeInTheDocument()
    expect(screen.queryByTestId(SKELETON_TEST_ID)).not.toBeInTheDocument()
  })
})
