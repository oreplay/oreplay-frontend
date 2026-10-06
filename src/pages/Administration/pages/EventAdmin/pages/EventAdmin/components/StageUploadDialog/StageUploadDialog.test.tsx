import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { postXmlUpload } from "./shared/postXmlUpload.ts"
import StageUploadDialog from "./StageUploadDialog.tsx"

vi.mock("./shared/postXmlUpload.ts", () => ({ postXmlUpload: vi.fn() }))
vi.mock("@toolpad/core/useNotifications", () => ({ useNotifications: () => ({ show: vi.fn() }) }))

const EVENT_ID = "event-1"
const STAGE_ID = "stage-1"
const xml = new File(["<ResultList/>"], "results.xml")

const neverAnswered = () => new Promise<never>(() => {})

const renderDialog = () => {
  const onClose = vi.fn()
  render(
    <StageUploadDialog eventId={EVENT_ID} stageId={STAGE_ID} stageName="Day 1" onClose={onClose} />,
  )
  return onClose
}

const startUploading = async () => {
  fireEvent.change(screen.getByTestId("upload-file-input"), { target: { files: [xml] } })
  await waitFor(() => expect(postXmlUpload).toHaveBeenCalled())
}

const requestClose = () => fireEvent.click(screen.getByTestId("stage-upload-close"))

const sentSignal = () => vi.mocked(postXmlUpload).mock.calls[0][3]

describe("StageUploadDialog", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(postXmlUpload).mockImplementation(neverAnswered)
  })

  it("uploads the picked files to its stage", async () => {
    renderDialog()

    await startUploading()

    expect(postXmlUpload).toHaveBeenCalledWith(EVENT_ID, STAGE_ID, xml, expect.any(AbortSignal))
  })

  it("closes straight away when nothing is uploading", () => {
    const onClose = renderDialog()

    requestClose()

    expect(onClose).toHaveBeenCalled()
  })

  it("asks before closing while uploading and keeps the request alive", async () => {
    const onClose = renderDialog()
    await startUploading()

    requestClose()

    expect(screen.getByTestId("cancel-upload-confirm")).toBeInTheDocument()
    expect(onClose).not.toHaveBeenCalled()
    expect(sentSignal().aborted).toBe(false)
  })

  it("aborts the request and closes once the cancellation is confirmed", async () => {
    const onClose = renderDialog()
    await startUploading()

    requestClose()
    fireEvent.click(screen.getByTestId("cancel-upload-confirm"))

    expect(sentSignal().aborted).toBe(true)
    expect(onClose).toHaveBeenCalled()
  })
})
