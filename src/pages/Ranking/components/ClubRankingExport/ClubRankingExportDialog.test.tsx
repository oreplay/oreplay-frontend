import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import ClubRankingExportDialog from "./ClubRankingExportDialog.tsx"
import { downloadClubRanking } from "./shared/downloadClubRanking.ts"

const notifyError = vi.fn()

vi.mock("./shared/downloadClubRanking.ts", () => ({ downloadClubRanking: vi.fn() }))
vi.mock("../../../../infrastructure/notifications/useNotifyError.ts", () => ({
  useNotifyError: () => notifyError,
}))

const EVENT_ID = "event-1"
const STAGE_ID = "stage-1"
const DOWNLOAD_LABEL = "ClubRankingExport.download"

const renderDialog = () => {
  const onClose = vi.fn()
  render(<ClubRankingExportDialog eventId={EVENT_ID} stageId={STAGE_ID} onClose={onClose} />)
  return { onClose }
}

describe("ClubRankingExportDialog", () => {
  beforeEach(() => vi.clearAllMocks())

  it("downloads the club ranking of the stage and closes", async () => {
    vi.mocked(downloadClubRanking).mockResolvedValue()
    const { onClose } = renderDialog()

    fireEvent.click(screen.getByRole("button", { name: DOWNLOAD_LABEL }))

    await waitFor(() => expect(onClose).toHaveBeenCalled())
    expect(downloadClubRanking).toHaveBeenCalledWith(EVENT_ID, STAGE_ID)
  })

  it("reports a failed download and stays open", async () => {
    const error = new Error("500")
    vi.mocked(downloadClubRanking).mockRejectedValue(error)
    const { onClose } = renderDialog()

    fireEvent.click(screen.getByRole("button", { name: DOWNLOAD_LABEL }))

    await waitFor(() => expect(notifyError).toHaveBeenCalledWith(error))
    expect(onClose).not.toHaveBeenCalled()
  })
})
