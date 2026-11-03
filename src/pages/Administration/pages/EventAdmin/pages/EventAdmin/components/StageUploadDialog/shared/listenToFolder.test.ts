import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fakeFolder, folderFile, NOW, SETTLED_AT } from "./folderFixtures.ts"
import { LISTEN_INTERVAL_MS, listenToFolder } from "./listenToFolder.ts"

const listen = (folder: FileSystemDirectoryHandle, isAccepted = true) => {
  const uploadFile = vi.fn().mockResolvedValue(isAccepted)
  const onFolderLost = vi.fn()
  const stop = listenToFolder(folder, { onFolderLost, uploadFile })
  return { onFolderLost, stop, uploadFile }
}

const uploadedNames = (uploadFile: ReturnType<typeof vi.fn>) =>
  uploadFile.mock.calls.map(([file]) => (file as File).name)

describe("listenToFolder", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(NOW.toMillis())
  })

  afterEach(() => vi.useRealTimers())

  it("uploads the files already in the folder right away and deletes them", async () => {
    const folder = fakeFolder("exports", [folderFile("results.xml")])

    const { uploadFile } = listen(folder.handle)
    await vi.advanceTimersByTimeAsync(0)

    expect(uploadedNames(uploadFile)).toEqual(["results.xml"])
    expect(folder.contents.size).toBe(0)
  })

  it("uploads files exported later on the next check", async () => {
    const folder = fakeFolder("exports")
    const { uploadFile } = listen(folder.handle)
    await vi.advanceTimersByTimeAsync(0)

    folder.write(folderFile("start.xml", NOW.toMillis()))
    await vi.advanceTimersByTimeAsync(LISTEN_INTERVAL_MS)

    expect(uploadedNames(uploadFile)).toEqual(["start.xml"])
  })

  it("keeps a refused file and retries it only once it is re-exported", async () => {
    const folder = fakeFolder("exports", [folderFile("results.xml")])
    const { uploadFile } = listen(folder.handle, false)
    await vi.advanceTimersByTimeAsync(LISTEN_INTERVAL_MS)

    expect(uploadFile).toHaveBeenCalledTimes(1)
    expect(folder.contents.has("results.xml")).toBe(true)

    folder.write(folderFile("results.xml", SETTLED_AT + 1))
    await vi.advanceTimersByTimeAsync(LISTEN_INTERVAL_MS)

    expect(uploadFile).toHaveBeenCalledTimes(2)
  })

  it("stops checking and aborts the upload in progress once stopped", async () => {
    const folder = fakeFolder("exports", [folderFile("results.xml")])
    const { stop, uploadFile } = listen(folder.handle)
    await vi.advanceTimersByTimeAsync(0)

    stop()
    folder.write(folderFile("start.xml"))
    await vi.advanceTimersByTimeAsync(LISTEN_INTERVAL_MS)

    expect((uploadFile.mock.calls[0][1] as AbortSignal).aborted).toBe(true)
    expect(uploadFile).toHaveBeenCalledTimes(1)
  })

  it("reports a folder that can no longer be read and stops checking it", async () => {
    const folder = fakeFolder("exports")
    vi.spyOn(folder.handle, "values").mockImplementation(() => {
      throw new DOMException("revoked", "NotAllowedError")
    })

    const { onFolderLost } = listen(folder.handle)
    await vi.advanceTimersByTimeAsync(LISTEN_INTERVAL_MS * 2)

    expect(onFolderLost).toHaveBeenCalledTimes(1)
  })
})
