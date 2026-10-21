import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { TRAIL_O_RESULTS_URL_MAX_LENGTH } from "./shared/trailOResultsUrl.ts"
import { useSaveExternalUrl } from "./shared/useSaveExternalUrl.ts"
import TrailOResultsUrlDialog from "./TrailOResultsUrlDialog.tsx"

vi.mock("./shared/useSaveExternalUrl.ts", () => ({ useSaveExternalUrl: vi.fn() }))

const TOP_URL = "https://top.yq.cz/event/123/results"
const OTHER_SITE_URL = "https://example.com/results"
const TOO_LONG_URL = `${TOP_URL}/${"a".repeat(TRAIL_O_RESULTS_URL_MAX_LENGTH)}`
const mutate = vi.fn()

/**
 * Renders the dialog for a stage.
 *
 * @param externalUrl URL already saved in the stage, none by default.
 * @returns The render result.
 */
const renderDialog = (externalUrl: string | null = null) =>
  render(
    <TrailOResultsUrlDialog
      eventId="event-1"
      stageId="stage-1"
      stageName="Day 1"
      externalUrl={externalUrl}
      onClose={vi.fn()}
      onSaved={vi.fn()}
    />,
  )

/**
 * Finds the results URL field.
 *
 * @returns The input element.
 */
const urlInput = () => screen.getByRole<HTMLInputElement>("textbox")

/**
 * Types a URL in the field and leaves it, as the organiser does.
 *
 * @param url Text typed in the field.
 */
const typeUrl = (url: string) => {
  fireEvent.change(urlInput(), { target: { value: url } })
  fireEvent.blur(urlInput())
}

/**
 * Presses the save button.
 */
const submit = () => fireEvent.click(screen.getByRole("button", { name: "common:save" }))

describe("TrailOResultsUrlDialog", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(useSaveExternalUrl).mockReturnValue({
      mutate,
      isLoading: false,
    } as unknown as ReturnType<typeof useSaveExternalUrl>)
  })

  it("shows the url already saved in the stage", () => {
    renderDialog(TOP_URL)

    expect(urlInput().value).toBe(TOP_URL)
  })

  it("saves a TOP url", async () => {
    renderDialog()

    typeUrl(` ${TOP_URL} `)
    submit()

    await waitFor(() => expect(mutate).toHaveBeenCalledWith(TOP_URL))
  })

  it("clears the url when it is left empty", async () => {
    renderDialog(TOP_URL)

    typeUrl("")
    submit()

    await waitFor(() => expect(mutate).toHaveBeenCalledWith(null))
  })

  it("rejects a url that is neither from TOP nor from Jaruori", async () => {
    renderDialog()

    typeUrl(OTHER_SITE_URL)
    submit()

    expect(await screen.findByText("EventAdmin.Stages.TrailOResultsUrl.InvalidUrl")).toBeVisible()
    expect(mutate).not.toHaveBeenCalled()
  })

  it("saves once a rejected url is corrected", async () => {
    renderDialog()

    typeUrl(OTHER_SITE_URL)
    typeUrl(TOP_URL)
    submit()

    await waitFor(() => expect(mutate).toHaveBeenCalledWith(TOP_URL))
  })

  it("flags a url that is too long while it is typed", () => {
    renderDialog()

    fireEvent.change(urlInput(), { target: { value: TOO_LONG_URL } })

    expect(screen.getByText("common:fieldTooLong")).toBeVisible()
    expect(screen.getByRole("button", { name: "common:save" })).toBeDisabled()
  })

  it("does not check the site until the url is saved", () => {
    renderDialog()

    typeUrl(OTHER_SITE_URL)

    expect(screen.queryByText("EventAdmin.Stages.TrailOResultsUrl.InvalidUrl")).toBeNull()
  })

  it("hides the site error as soon as the url is edited again", async () => {
    renderDialog()

    typeUrl(OTHER_SITE_URL)
    submit()
    await screen.findByText("EventAdmin.Stages.TrailOResultsUrl.InvalidUrl")
    typeUrl(TOP_URL)

    await waitFor(() =>
      expect(screen.queryByText("EventAdmin.Stages.TrailOResultsUrl.InvalidUrl")).toBeNull(),
    )
  })
})
