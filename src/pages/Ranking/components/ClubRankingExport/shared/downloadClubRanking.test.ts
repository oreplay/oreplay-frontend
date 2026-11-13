import { beforeEach, describe, expect, it, vi } from "vitest"
import { getListResults } from "../../../../../infrastructure/repositories/results/results.ts"
import { saveBlob } from "../../../shared/saveBlob.ts"
import {
  CLUB_RANKING_FILENAME,
  CLUB_RANKING_OUTPUT,
  downloadClubRanking,
} from "./downloadClubRanking.ts"

vi.mock("../../../../../infrastructure/repositories/results/results.ts", () => ({
  getListResults: vi.fn(),
}))
vi.mock("../../../shared/saveBlob.ts", () => ({ saveBlob: vi.fn() }))

const EVENT_ID = "event-1"
const STAGE_ID = "stage-1"

describe("downloadClubRanking", () => {
  beforeEach(() => vi.clearAllMocks())

  it("requests the club ranking output as a file and saves it as csv", async () => {
    const csv = new Blob(["Club;Points"])
    vi.mocked(getListResults).mockResolvedValue(csv as never)

    await downloadClubRanking(EVENT_ID, STAGE_ID)

    expect(getListResults).toHaveBeenCalledWith(
      EVENT_ID,
      STAGE_ID,
      { output: CLUB_RANKING_OUTPUT },
      { responseType: "blob" },
    )
    expect(saveBlob).toHaveBeenCalledWith(csv, CLUB_RANKING_FILENAME)
  })

  it("saves nothing when the request fails", async () => {
    vi.mocked(getListResults).mockRejectedValue(new Error("500"))

    await expect(downloadClubRanking(EVENT_ID, STAGE_ID)).rejects.toThrow("500")
    expect(saveBlob).not.toHaveBeenCalled()
  })
})
