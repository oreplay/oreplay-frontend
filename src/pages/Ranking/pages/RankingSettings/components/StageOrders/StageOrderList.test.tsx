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
        onAction={vi.fn()}
      />,
    )
    expect(screen.getAllByRole("listitem")).toHaveLength(2)
    expect(screen.getByText("01 - Stage 1")).toBeInTheDocument()
  })

  it("shows the empty state when there are no stage orders", () => {
    render(<StageOrderList isLoading={false} isError={false} stageOrders={[]} onAction={vi.fn()} />)
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument()
  })

  it("dispatches the organizers action when a row is clicked", () => {
    const onAction = vi.fn()
    render(
      <StageOrderList
        isLoading={false}
        isError={false}
        stageOrders={[makeStageOrder("a", 1)]}
        onAction={onAction}
      />,
    )
    screen.getByRole("listitem").click()
    expect(onAction).toHaveBeenCalledWith("organizers", makeStageOrder("a", 1))
  })
})
