import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import OutdatedDataMsg from "./OutdatedDataMsg.tsx"

describe("OutdatedDataMsg", () => {
  it("warns that the results may be outdated", () => {
    render(<OutdatedDataMsg />)

    expect(screen.getByRole("alert")).toHaveTextContent("ResultsStage.OutdatedData")
  })
})
