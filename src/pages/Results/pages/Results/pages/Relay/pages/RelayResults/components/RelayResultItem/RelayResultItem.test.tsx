import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { baseLegFixture, baseRelayRunnerFixture } from "../../../../shared/relayFixtures.ts"
import RelayResultItem from "./RelayResultItem.tsx"

const TEAM_NAME = "Aligots Aligot 9"
const FIRST_LEG_NAME = "Xenia Riera"
const SECOND_LEG_NAME = "Cesc Amat"
const SECOND_LEG_NUMBER = 2

/**
 * Builds a relay team of two legs.
 *
 * @returns The team, with its leg runners in `runners`.
 */
function buildTeam(): ProcessedRunnerModel {
  return {
    ...baseRelayRunnerFixture,
    full_name: TEAM_NAME,
    runners: [
      { ...baseLegFixture, id: "leg1", full_name: FIRST_LEG_NAME, leg_number: 1 },
      {
        ...baseLegFixture,
        id: "leg2",
        full_name: SECOND_LEG_NAME,
        leg_number: SECOND_LEG_NUMBER,
      },
    ],
  }
}

describe("RelayResultItem", () => {
  it("renders every leg as its own clickable line under the team", () => {
    render(<RelayResultItem runner={buildTeam()} handleRowClick={vi.fn()} isClass />)

    expect(screen.getByText(TEAM_NAME)).toBeInTheDocument()
    expect(screen.getAllByRole("button")).toHaveLength(2)
    expect(screen.getByText(FIRST_LEG_NAME)).toBeInTheDocument()
    expect(screen.getByText(SECOND_LEG_NAME)).toBeInTheDocument()
  })

  it("opens the ticket of the clicked leg", () => {
    const team = buildTeam()
    const handleRowClick = vi.fn()
    render(<RelayResultItem runner={team} handleRowClick={handleRowClick} isClass />)

    fireEvent.click(screen.getByText(SECOND_LEG_NAME))

    expect(handleRowClick).toHaveBeenCalledExactlyOnceWith(team, SECOND_LEG_NUMBER)
  })
})
