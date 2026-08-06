import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import StageOrderList from "./StageOrderList.tsx"
import { StageOrderManagement } from "../../../../../../domain/types/v1api"

const makeStageOrder = (id: string, order: number): StageOrderManagement => ({
  created: "2026-01-01T00:00:00+00:00",
  description: `Stage ${order}`,
  id,
  is_official: true,
  original_event_id: "evt-1",
  original_stage_id: "stg-1",
  stage_order: order,
  start: "2026-05-01T08:30:00+00:00",
})

describe("StageOrderList", () => {
  it("renders one row per stage order", () => {
    render(
      <StageOrderList
        isLoading={false}
        isError={false}
        stageOrders={[makeStageOrder("a", 1), makeStageOrder("b", 2)]}
        onEdit={vi.fn()}
        onManageOrganizers={vi.fn()}
        onProcessResults={vi.fn()}
      />,
    )
    expect(screen.getAllByRole("listitem")).toHaveLength(2)
    expect(screen.getByText("01 - Stage 1")).toBeInTheDocument()
  })

  it("shows the empty state when there are no stage orders", () => {
    render(
      <StageOrderList
        isLoading={false}
        isError={false}
        stageOrders={[]}
        onEdit={vi.fn()}
        onManageOrganizers={vi.fn()}
        onProcessResults={vi.fn()}
      />,
    )
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument()
  })

  it("invokes onManageOrganizers when a row is clicked", () => {
    const onManageOrganizers = vi.fn()
    render(
      <StageOrderList
        isLoading={false}
        isError={false}
        stageOrders={[makeStageOrder("a", 1)]}
        onEdit={vi.fn()}
        onManageOrganizers={onManageOrganizers}
        onProcessResults={vi.fn()}
      />,
    )
    screen.getByRole("listitem").click()
    expect(onManageOrganizers).toHaveBeenCalledWith(makeStageOrder("a", 1))
  })
})
