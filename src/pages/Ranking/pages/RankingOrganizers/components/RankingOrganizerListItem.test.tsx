import { fireEvent, render, screen } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "react-query"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { Participant, RankingOrganizer } from "../../../../../domain/types/v1api"
import { UPLOAD_TYPES } from "../../../../Results/pages/Results/shared/constants.ts"
import RankingOrganizerListItem from "./RankingOrganizerListItem.tsx"

const mocks = vi.hoisted(() => ({
  participants: [] as Participant[],
  isLoadingResults: false,
  mutateAsync: vi.fn(),
}))

vi.mock("../../../../../infrastructure/repositories/results/results.ts", () => ({
  getGetListResultsQueryKey: () => ["results"],
  useGetListResults: () => ({
    data: { data: mocks.participants },
    isLoading: mocks.isLoadingResults,
  }),
}))

vi.mock(
  "../../../../../infrastructure/repositories/ranking-runner-management/ranking-runner-management.ts",
  () => ({
    usePostListRankingRunnerManagement: () => ({
      mutateAsync: mocks.mutateAsync,
      isLoading: false,
    }),
  }),
)

vi.mock("../../../../../infrastructure/notifications/useNotifyError.ts", () => ({
  useNotifyError: () => vi.fn(),
}))

const ADD_BUTTON_NAME = "RankingOrganizers.addToClass"
const DELETE_BUTTON_NAME = "common:delete"

const organizer: RankingOrganizer = {
  created: "2026-01-01T00:00:00+00:00",
  first_name: "Felipe",
  id: "org-1",
  last_name: "Peña Pita",
  modified: "2026-01-01T00:00:00+00:00",
  runner_id: "runner-1",
  stage_order_id: "so-1",
}

const participantWithParts = (stageOrders: number[]): Participant => ({
  bib_number: 1,
  class: { id: "class-1", long_name: "Hombres 35", short_name: "H-35" },
  club: { id: "club-1", short_name: "Club" },
  created: "2026-01-01T00:00:00+00:00",
  eligibility: "",
  full_name: "Felipe Peña Pita",
  id: "runner-1",
  is_nc: false,
  overalls: {
    parts: stageOrders.map((stageOrder) => ({
      id: `part-${stageOrder}`,
      points_final: 100,
      position: 1,
      stage_order: stageOrder,
      status_code: 0,
      upload_type: "total_points",
    })),
  },
})

const rankingContext = { rankingId: "rk-1", eventId: "evt-1", stageId: "stg-1", stageOrder: 2 }

const renderItem = (item: RankingOrganizer = organizer) =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ul>
        <RankingOrganizerListItem
          organizer={item}
          rankingContext={rankingContext}
          onRemove={vi.fn()}
        />
      </ul>
    </QueryClientProvider>,
  )

describe("RankingOrganizerListItem", () => {
  beforeEach(() => {
    mocks.mutateAsync.mockReset()
    mocks.isLoadingResults = false
    mocks.participants = []
  })

  it("adds the runner as organizer of the stage order when it has no result there", () => {
    mocks.participants = [participantWithParts([1])]
    renderItem()
    fireEvent.click(screen.getByRole("button", { name: ADD_BUTTON_NAME }))
    expect(mocks.mutateAsync).toHaveBeenCalledWith({
      rankingID: "rk-1",
      eventID: "evt-1",
      stageID: "stg-1",
      data: {
        upload_type: UPLOAD_TYPES.COMPUTABLE_ORG,
        runner_id: "runner-1",
        stage_order: 2,
      },
    })
    expect(screen.getByRole("button", { name: DELETE_BUTTON_NAME })).toBeInTheDocument()
  })

  it("shows only the runner class when it already has a result in the stage order", () => {
    mocks.participants = [participantWithParts([1, 2])]
    renderItem()
    expect(screen.getByText("H-35")).toBeInTheDocument()
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("hides the delete button while the ranking status is loading", () => {
    mocks.isLoadingResults = true
    renderItem()
    expect(screen.getByRole("status")).toBeInTheDocument()
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("keeps the delete button for an organizer missing from the ranking", () => {
    renderItem({ ...organizer, runner_id: null })
    expect(screen.getByRole("button", { name: DELETE_BUTTON_NAME })).toBeInTheDocument()
  })
})
