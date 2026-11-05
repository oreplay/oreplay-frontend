import { beforeEach, describe, expect, it, vi } from "vitest"
import { get } from "../../../services/ApiConfig.ts"
import { getEventStats } from "./EventAdminService.ts"

vi.mock("../../../services/ApiConfig.ts", () => ({
  deleteRequest: vi.fn(),
  get: vi.fn(),
  patch: vi.fn(),
  post: vi.fn(),
}))

describe("getEventStats", () => {
  beforeEach(() => {
    vi.mocked(get).mockReset()
  })

  it("asks the FEDO stats endpoint, whose grouped shape the stats tables expect", async () => {
    await getEventStats("event", "stage")

    const url = vi.mocked(get).mock.calls[0][0]
    expect(url).toContain("/event/stages/stage/stats-fedo?")
    expect(url).toContain("officialSub20M=")
  })
})
