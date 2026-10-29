import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import OfficialResultsAnnouncement from "./OfficialResultsAnnouncement.tsx"

describe("OfficialResultsAnnouncement", () => {
  it("announces the official results feature", () => {
    render(<OfficialResultsAnnouncement />)
    expect(screen.getByRole("alert")).toHaveTextContent("officialResults.title")
  })
})
