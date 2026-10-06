import { renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useXmlFilesIntake } from "./useXmlFilesIntake.ts"

const show = vi.hoisted(() => vi.fn())

vi.mock("@toolpad/core/useNotifications", () => ({ useNotifications: () => ({ show }) }))

const xml = new File(["<ResultList/>"], "results.xml")
const pdf = new File(["%PDF"], "results.pdf")

const intake = (files: File[]) => {
  const onXmlFiles = vi.fn()
  const { result } = renderHook(() => useXmlFilesIntake(onXmlFiles))
  result.current(files)
  return onXmlFiles
}

describe("useXmlFilesIntake", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("hands over the xml files and warns about the ignored ones", () => {
    const onXmlFiles = intake([xml, pdf])

    expect(onXmlFiles).toHaveBeenCalledWith([xml])
    expect(show).toHaveBeenCalledWith(
      "EventAdmin.DataUpload.filesIgnored",
      expect.objectContaining({ severity: "warning" }),
    )
  })

  it("stays silent when every file is xml", () => {
    intake([xml])

    expect(show).not.toHaveBeenCalled()
  })

  it("hands nothing over when no file is xml", () => {
    const onXmlFiles = intake([pdf])

    expect(onXmlFiles).not.toHaveBeenCalled()
  })
})
