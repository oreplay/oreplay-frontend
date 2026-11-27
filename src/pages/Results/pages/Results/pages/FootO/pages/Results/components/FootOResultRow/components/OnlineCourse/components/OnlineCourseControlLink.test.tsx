import { fireEvent, render } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"
import OnlineCourseControlLink from "./OnlineCourseControlLink.tsx"

const STAGE_PATH = "/competitions/event-1/stage-1"
const STATION = "42"

/**
 * Renders a control link inside a clickable row, the way a result row holds the online course.
 *
 * @param path Page the link is rendered on.
 * @param onRowActivate Called when the row receives a click or a key press.
 * @returns The rendered container.
 */
function renderInRow(path: string, onRowActivate: () => void) {
  const row = (
    <div onClick={onRowActivate} onKeyDown={onRowActivate} role="presentation">
      <svg>
        <OnlineCourseControlLink station={STATION}>
          <text>{STATION}</text>
        </OnlineCourseControlLink>
      </svg>
    </div>
  )
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="competitions/:eventId/:stageId" element={row} />
        <Route path="relay-mockup" element={row} />
        <Route path="*" element={null} />
      </Routes>
    </MemoryRouter>,
  )
}

describe("OnlineCourseControlLink", () => {
  it("links the control to its page in the stage", () => {
    const { container } = renderInRow(STAGE_PATH, vi.fn())

    expect(container.querySelector("a")?.getAttribute("href")).toBe(
      `${STAGE_PATH}/control/${STATION}`,
    )
  })

  it("keeps a click and the Enter key from opening the row's ticket", () => {
    const onRowActivate = vi.fn()
    const { container } = renderInRow(STAGE_PATH, onRowActivate)
    const link = container.querySelector("a")!

    fireEvent.keyDown(link, { key: "Enter" })
    fireEvent.click(link)

    expect(onRowActivate).not.toHaveBeenCalled()
  })

  it("draws the control without a link outside a stage", () => {
    const { container } = renderInRow("/relay-mockup", vi.fn())

    expect(container.querySelector("a")).toBeNull()
    expect(container.querySelector("text")?.textContent).toBe(STATION)
  })
})
