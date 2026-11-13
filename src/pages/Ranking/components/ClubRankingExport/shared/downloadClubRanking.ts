import { orvalAxiosInstance } from "../../../../../infrastructure/orval/orval-axios-instance.ts"
import { saveBlob } from "../../../shared/saveBlob.ts"

export const CLUB_RANKING_OUTPUT = "AgeGroupClubs"
export const CLUB_RANKING_FILENAME = "club-ranking.csv"

function clubRankingPath(eventId: string, stageId: string): string {
  return `/api/v1/events/${eventId}/stages/${stageId}/resultsByClass`
}

export async function downloadClubRanking(eventId: string, stageId: string): Promise<void> {
  const blob = await orvalAxiosInstance<Blob>({
    url: clubRankingPath(eventId, stageId),
    method: "GET",
    params: { output: CLUB_RANKING_OUTPUT },
    responseType: "blob",
  })
  saveBlob(blob, CLUB_RANKING_FILENAME)
}
