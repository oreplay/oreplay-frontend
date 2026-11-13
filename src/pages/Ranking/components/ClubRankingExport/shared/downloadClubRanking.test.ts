import { beforeEach, describe, expect, it, vi } from "vitest"
import { orvalAxiosInstance } from "../../../../../infrastructure/orval/orval-axios-instance.ts"
import { saveBlob } from "../../../shared/saveBlob.ts"
import {
  CLUB_RANKING_FILENAME,
  CLUB_RANKING_OUTPUT,
  downloadClubRanking,
} from "./downloadClubRanking.ts"

vi.mock("../../../../../infrastructure/orval/orval-axios-instance.ts", () => ({
  orvalAxiosInstance: vi.fn(),
}))
vi.mock("../../../shared/saveBlob.ts", () => ({ saveBlob: vi.fn() }))

const EVENT_ID = "event-1"
const STAGE_ID = "stage-1"

describe("downloadClubRanking", () => {
  beforeEach(() => vi.clearAllMocks())

  it("requests the club ranking output of the stage as a file and saves it as csv", async () => {
    const csv = new Blob(["Club;Points"])
    vi.mocked(orvalAxiosInstance).mockResolvedValue(csv)

    await downloadClubRanking(EVENT_ID, STAGE_ID)

    expect(orvalAxiosInstance).toHaveBeenCalledWith({
      url: `/api/v1/events/${EVENT_ID}/stages/${STAGE_ID}/resultsByClass`,
      method: "GET",
      params: { output: CLUB_RANKING_OUTPUT },
      responseType: "blob",
    })
    expect(saveBlob).toHaveBeenCalledWith(csv, CLUB_RANKING_FILENAME)
  })

  it("saves nothing when the request fails", async () => {
    vi.mocked(orvalAxiosInstance).mockRejectedValue(new Error("500"))

    await expect(downloadClubRanking(EVENT_ID, STAGE_ID)).rejects.toThrow("500")
    expect(saveBlob).not.toHaveBeenCalled()
  })
})
