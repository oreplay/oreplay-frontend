import { createEvent, fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import {
  GRAPH_VIEW,
  GRAPH_VIEW_DESCRIPTION_KEY,
  GRAPH_VIEW_TITLE_KEY,
  GraphView,
} from "../../shared/graphViews.ts"
import { MOUSE_POINTER_TYPE } from "../../../../shared/infoTipVisibility.ts"
import GraphsToolbar from "./GraphsToolbar.tsx"

const DESCRIPTION_LABEL = "Graphs.DescriptionLabel"
const STICKY_TOP_PX = 59
const TOUCH_POINTER_TYPE = "touch"

/**
 * Moves a pointer onto an element. jsdom drops `pointerType` from pointer events, so it is set by
 * hand on the event.
 *
 * @param element Element the pointer enters.
 * @param pointerType Kind of pointer, such as `mouse` or `touch`.
 */
function enterWithPointer(element: HTMLElement, pointerType: string) {
  const event = createEvent.pointerOver(element)
  Object.defineProperty(event, "pointerType", { value: pointerType })
  fireEvent(element, event)
}

function renderToolbar(selectedView: GraphView = GRAPH_VIEW.LineChart) {
  const onViewChange = vi.fn()
  const { container } = render(
    <GraphsToolbar
      onViewChange={onViewChange}
      selectedView={selectedView}
      stickyTopPx={STICKY_TOP_PX}
    />,
  )
  return { container, onViewChange }
}

describe("GraphsToolbar", () => {
  it("sticks at the given distance from the top", () => {
    renderToolbar()

    expect(screen.getByRole("radiogroup").parentElement).toHaveStyle({
      top: `${STICKY_TOP_PX}px`,
    })
  })

  it("offers one option per graph", () => {
    renderToolbar()

    expect(screen.getAllByRole("radio")).toHaveLength(Object.values(GRAPH_VIEW).length)
  })

  it("marks only the selected graph as checked", () => {
    renderToolbar(GRAPH_VIEW.PositionChart)

    expect(screen.getByRole("radio", { checked: true })).toHaveTextContent("view.positionChart")
  })

  it("writes the full name of the selected graph below the selector for small screens", () => {
    const { container } = renderToolbar(GRAPH_VIEW.PerfectRunnerChart)
    const title = container.querySelector(".graphs-toolbar-title")

    expect(title).toHaveTextContent(GRAPH_VIEW_TITLE_KEY[GRAPH_VIEW.PerfectRunnerChart])
    expect(title).toHaveClass("sm:hidden")
  })

  it("keeps the explanation of the graph hidden until it is asked for", () => {
    renderToolbar()

    expect(screen.getByRole("button", { name: DESCRIPTION_LABEL })).toHaveAttribute(
      "aria-expanded",
      "false",
    )
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
  })

  it("shows the explanation of the selected graph when the info icon is clicked", () => {
    renderToolbar(GRAPH_VIEW.PositionChart)

    fireEvent.click(screen.getByRole("button", { name: DESCRIPTION_LABEL }))

    expect(screen.getByRole("tooltip")).toHaveTextContent(
      GRAPH_VIEW_DESCRIPTION_KEY[GRAPH_VIEW.PositionChart],
    )
  })

  it("shows the explanation while the info icon is hovered with a mouse", () => {
    const { container } = renderToolbar()
    const hoverArea = container.querySelector(".info-tip") as HTMLElement

    enterWithPointer(hoverArea, MOUSE_POINTER_TYPE)
    expect(screen.getByRole("tooltip")).toBeInTheDocument()

    fireEvent.pointerLeave(hoverArea)
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
  })

  it("does not open the explanation on the hover a tap fires", () => {
    const { container } = renderToolbar()
    const hoverArea = container.querySelector(".info-tip") as HTMLElement

    enterWithPointer(hoverArea, TOUCH_POINTER_TYPE)

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
  })

  it("hides a pinned explanation when the info icon is clicked again", () => {
    renderToolbar()
    const infoButton = screen.getByRole("button", { name: DESCRIPTION_LABEL })

    fireEvent.click(infoButton)
    fireEvent.click(infoButton)

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
  })

  it("hides a pinned explanation with Escape", () => {
    renderToolbar()
    const infoButton = screen.getByRole("button", { name: DESCRIPTION_LABEL })

    fireEvent.click(infoButton)
    fireEvent.keyDown(infoButton, { key: "Escape" })

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
  })

  it("changes the graph when another option is clicked", () => {
    const { onViewChange } = renderToolbar()

    fireEvent.click(screen.getByRole("radio", { name: "view.perfectRunnerChart" }))

    expect(onViewChange).toHaveBeenCalledWith(GRAPH_VIEW.PerfectRunnerChart)
  })
})
