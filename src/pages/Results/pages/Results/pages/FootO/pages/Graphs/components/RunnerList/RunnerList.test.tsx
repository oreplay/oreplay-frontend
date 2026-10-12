import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { UPLOAD_TYPES } from "../../../../../../shared/constants.ts"
import RunnerList from "./RunnerList.tsx"

const CLEAR_SELECTION_LABEL = "Graphs.ClearSelection"
const SELECT_ALL_LABEL = "Graphs.SelectAll"

/**
 * Builds a runner with just the fields the runner list reads.
 *
 * @param id Runner id, also used as its name.
 * @param position Position in the class; `0` for a runner that is not classified.
 * @returns The runner.
 */
function buildRunner(id: string, position: number = 1): ProcessedRunnerModel {
  return {
    club: { short_name: `club-${id}` },
    full_name: id,
    id,
    stage: { position, time_seconds: 1234, upload_type: UPLOAD_TYPES.SPLIT_RESULT },
  } as ProcessedRunnerModel
}

const RUNNERS = [buildRunner("ana"), buildRunner("bea"), buildRunner("cai", 0)]

/**
 * Renders the list with the given selection.
 *
 * @param selectedRunnerIds Ids of the runners selected.
 * @returns The spy called when the selection changes.
 */
function renderList(selectedRunnerIds: string[]) {
  const onSelectionChange = vi.fn()
  render(
    <RunnerList
      onSelectionChange={onSelectionChange}
      runners={RUNNERS}
      selectedRunnerIds={selectedRunnerIds}
    />,
  )
  return onSelectionChange
}

describe("RunnerList", () => {
  it("lists every runner with its club", () => {
    renderList([])
    expect(screen.getAllByRole("checkbox")).toHaveLength(RUNNERS.length)
    expect(screen.getByText("club-bea")).toBeInTheDocument()
  })

  it("checks only the selected runners", () => {
    renderList(["bea"])
    expect(screen.getByRole("checkbox", { name: /bea/ })).toBeChecked()
    expect(screen.getByRole("checkbox", { name: /ana/ })).not.toBeChecked()
  })

  it("disables a runner that cannot be plotted", () => {
    renderList([])
    expect(screen.getByRole("checkbox", { name: /cai/ })).toBeDisabled()
  })

  it("adds a runner to the selection when clicked", () => {
    const onSelectionChange = renderList(["ana"])
    fireEvent.click(screen.getByRole("checkbox", { name: /bea/ }))
    expect(onSelectionChange).toHaveBeenCalledWith(["ana", "bea"])
  })

  it("takes a selected runner out when clicked", () => {
    const onSelectionChange = renderList(["ana", "bea"])
    fireEvent.click(screen.getByRole("checkbox", { name: /ana/ }))
    expect(onSelectionChange).toHaveBeenCalledWith(["bea"])
  })

  it("selects every selectable runner at once", () => {
    const onSelectionChange = renderList(["ana"])
    fireEvent.click(screen.getByRole("button", { name: SELECT_ALL_LABEL }))
    expect(onSelectionChange).toHaveBeenCalledWith(["ana", "bea"])
  })

  it("clears the selection once every runner is selected", () => {
    const onSelectionChange = renderList(["ana", "bea"])
    fireEvent.click(screen.getByRole("button", { name: CLEAR_SELECTION_LABEL }))
    expect(onSelectionChange).toHaveBeenCalledWith([])
  })
})
