import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import EventTokenDataGrid from "./EventTokenDataGrid.tsx"
import { getEventToken } from "../../../../../services/EventAdminService.ts"
import {
  deleteEventTokens,
  postListEventTokens,
} from "../../../../../../../infrastructure/repositories/event-tokens/event-tokens.ts"

const EVENT_ID = "event"
const OLD_TOKEN = "old-token"
const notifyError = vi.fn()

vi.mock("../../../../../services/EventAdminService.ts", () => ({ getEventToken: vi.fn() }))
vi.mock("../../../../../../../infrastructure/repositories/event-tokens/event-tokens.ts", () => ({
  deleteEventTokens: vi.fn(),
  postListEventTokens: vi.fn(),
}))
vi.mock("../../../../../../../shared/hooks.ts", () => ({ useAuth: () => ({ token: "user" }) }))
vi.mock("../../../../../../../infrastructure/notifications/useNotifyError.ts", () => ({
  useNotifyError: () => notifyError,
}))

/**
 * Renders the token field for an event that already has a valid token, and waits until it shows.
 */
async function renderWithExistingToken() {
  vi.mocked(getEventToken).mockResolvedValue({
    data: [{ token: OLD_TOKEN, expires: "2099-01-01T00:00:00+00:00", created: "" }],
  })
  render(<EventTokenDataGrid event_id={EVENT_ID} />)
  await waitFor(() =>
    expect(screen.getByDisplayValue(`${EVENT_ID}${OLD_TOKEN}`)).toBeInTheDocument(),
  )
}

/**
 * Opens the renew confirmation and confirms it.
 */
function confirmRenewal() {
  fireEvent.click(screen.getByTestId("AutorenewIcon"))
  const buttons = screen.getAllByRole("button")
  fireEvent.click(buttons[buttons.length - 1])
}

describe("EventTokenDataGrid", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("does not create a new token when the old one cannot be revoked", async () => {
    vi.mocked(deleteEventTokens).mockRejectedValue(new Error("network"))
    await renderWithExistingToken()

    confirmRenewal()

    await waitFor(() => expect(notifyError).toHaveBeenCalled())
    expect(deleteEventTokens).toHaveBeenCalledWith(EVENT_ID, OLD_TOKEN)
    expect(postListEventTokens).not.toHaveBeenCalled()
  })

  it("reports a failed load instead of loading forever", async () => {
    vi.mocked(getEventToken).mockRejectedValue(new Error("network"))
    render(<EventTokenDataGrid event_id={EVENT_ID} />)

    await waitFor(() => expect(notifyError).toHaveBeenCalled())
    expect(screen.queryByDisplayValue("common:loading")).not.toBeInTheDocument()
  })
})
