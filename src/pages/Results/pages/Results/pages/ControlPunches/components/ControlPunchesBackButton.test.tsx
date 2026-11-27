import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom"
import { describe, expect, it } from "vitest"
import ControlPunchesBackButton from "./ControlPunchesBackButton.tsx"

const STAGE_PATH = "/competitions/event-1/stage-1"
const CONTROL_PATH = `${STAGE_PATH}/control/42`
const OPEN_CONTROL = "open control"

/**
 * A stage page with a button that opens the control page inside the app.
 *
 * @returns The button.
 */
function StagePage() {
  const navigate = useNavigate()
  return <button onClick={() => void navigate(CONTROL_PATH)}>{OPEN_CONTROL}</button>
}

/**
 * Renders the back button on the control page, starting the visit at `path`.
 *
 * @param path Page the visit starts on.
 */
function renderFrom(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="competitions/:eventId/:stageId" element={<StagePage />} />
        <Route
          path="competitions/:eventId/:stageId/control/:station"
          element={<ControlPunchesBackButton eventId="event-1" stageId="stage-1" />}
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe("ControlPunchesBackButton", () => {
  it("leads back to the stage results when the control page is opened directly", () => {
    renderFrom(CONTROL_PATH)

    expect(screen.getByRole("link").getAttribute("href")).toBe(STAGE_PATH)
  })

  it("is not shown after navigating inside the app, as the header already goes back", () => {
    renderFrom(STAGE_PATH)

    fireEvent.click(screen.getByText(OPEN_CONTROL))

    expect(screen.queryByRole("link")).toBeNull()
  })
})
