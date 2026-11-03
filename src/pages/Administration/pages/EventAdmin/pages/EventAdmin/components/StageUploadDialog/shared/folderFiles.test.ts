import { describe, expect, it, vi } from "vitest"
import {
  filesToUpload,
  fileVersionOf,
  isFolderListeningSupported,
  isPickerDismissed,
  pickFolder,
  readXmlFiles,
  removeIfUnchanged,
} from "./folderFiles.ts"
import { fakeFolder, folderFile, JUST_WRITTEN_AT, NOW, SETTLED_AT } from "./folderFixtures.ts"

const NOW_MILLIS = NOW.toMillis()

describe("fileVersionOf", () => {
  it("changes when the file is re-exported", () => {
    const original = folderFile("results.xml", SETTLED_AT)
    const reExported = folderFile("results.xml", SETTLED_AT + 1)

    expect(fileVersionOf(reExported)).not.toBe(fileVersionOf(original))
  })

  it("stays the same while the file is unchanged", () => {
    expect(fileVersionOf(folderFile("results.xml"))).toBe(fileVersionOf(folderFile("results.xml")))
  })
})

describe("filesToUpload", () => {
  it("leaves out files still being written", () => {
    const writing = folderFile("results.xml", JUST_WRITTEN_AT)

    expect(filesToUpload([writing], new Set(), NOW_MILLIS)).toEqual([])
  })

  it("leaves out file versions already handled", () => {
    const handled = folderFile("results.xml")

    expect(filesToUpload([handled], new Set([fileVersionOf(handled)]), NOW_MILLIS)).toEqual([])
  })

  it("keeps a handled file once it is re-exported", () => {
    const handled = folderFile("results.xml", SETTLED_AT - 1)
    const reExported = folderFile("results.xml", SETTLED_AT)

    expect(filesToUpload([reExported], new Set([fileVersionOf(handled)]), NOW_MILLIS)).toEqual([
      reExported,
    ])
  })

  it("orders the files oldest first", () => {
    const results = folderFile("results.xml", SETTLED_AT)
    const startList = folderFile("start.xml", SETTLED_AT - 1)

    expect(filesToUpload([results, startList], new Set(), NOW_MILLIS)).toEqual([startList, results])
  })
})

describe("isFolderListeningSupported", () => {
  it("is true when the folder picker exists", () => {
    expect(isFolderListeningSupported({ showDirectoryPicker: vi.fn() })).toBe(true)
  })

  it("is false without the folder picker", () => {
    expect(isFolderListeningSupported({})).toBe(false)
  })
})

describe("isPickerDismissed", () => {
  it("is true when the user closed the picker", () => {
    expect(isPickerDismissed(new DOMException("closed", "AbortError"))).toBe(true)
  })

  it("is false for any other error", () => {
    expect(isPickerDismissed(new DOMException("denied", "NotAllowedError"))).toBe(false)
  })
})

describe("pickFolder", () => {
  it("asks for a folder it may delete files from", async () => {
    const folder = fakeFolder("exports").handle
    const showDirectoryPicker = vi.fn().mockResolvedValue(folder)

    await expect(pickFolder({ showDirectoryPicker })).resolves.toBe(folder)
    expect(showDirectoryPicker).toHaveBeenCalledWith(expect.objectContaining({ mode: "readwrite" }))
  })

  it("rejects when the browser has no folder picker", async () => {
    await expect(pickFolder({})).rejects.toBeInstanceOf(DOMException)
  })
})

describe("readXmlFiles", () => {
  it("reads only the XML files, ignoring subfolders and other files", async () => {
    const results = folderFile("Results.XML")
    const folder = fakeFolder("exports", [results, folderFile("splits.csv")])

    await expect(readXmlFiles(folder.handle)).resolves.toEqual([results])
  })
})

describe("removeIfUnchanged", () => {
  it("deletes the uploaded file", async () => {
    const uploaded = folderFile("results.xml")
    const folder = fakeFolder("exports", [uploaded])

    await expect(removeIfUnchanged(folder.handle, uploaded)).resolves.toBe(true)
    expect(folder.contents.has("results.xml")).toBe(false)
  })

  it("keeps a file re-exported after its upload", async () => {
    const uploaded = folderFile("results.xml", SETTLED_AT - 1)
    const folder = fakeFolder("exports", [folderFile("results.xml", SETTLED_AT)])

    await expect(removeIfUnchanged(folder.handle, uploaded)).resolves.toBe(false)
    expect(folder.contents.has("results.xml")).toBe(true)
  })

  it("tolerates a file that is already gone", async () => {
    const folder = fakeFolder("exports")

    await expect(removeIfUnchanged(folder.handle, folderFile("results.xml"))).resolves.toBe(false)
  })
})
