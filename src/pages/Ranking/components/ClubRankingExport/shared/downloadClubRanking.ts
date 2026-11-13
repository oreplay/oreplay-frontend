import { getListResults } from "../../../../../infrastructure/repositories/results/results.ts"
import { saveBlob } from "../../../shared/saveBlob.ts"

export const CLUB_RANKING_OUTPUT = "AgeGroupClubs"
export const CLUB_RANKING_FILENAME = "club-ranking.csv"

export async function downloadClubRanking(eventId: string, stageId: string): Promise<void> {
  const blob = (await getListResults(
    eventId,
    stageId,
    { output: CLUB_RANKING_OUTPUT },
    { responseType: "blob" },
  )) as unknown as Blob
  saveBlob(blob, CLUB_RANKING_FILENAME)
}
