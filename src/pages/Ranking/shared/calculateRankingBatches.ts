import { orvalAxiosInstance } from "../../../infrastructure/orval/orval-axios-instance.ts"
import { postListRankingComputeStage } from "../../../infrastructure/repositories/ranking-compute-stage/ranking-compute-stage.ts"

/** Reports how many per-class compute requests have completed out of the total. */
export type RankingComputeProgress = (completed: number, total: number) => void

const postInBatches = async (
  urls: string[],
  batchSize: number,
  onProgress?: RankingComputeProgress,
) => {
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize)
    await Promise.all(
      batch.map((path) =>
        orvalAxiosInstance({
          // The returned URLs are relative and lack the `/api/v1` prefix the
          // axios base URL already carries; add it when missing.
          url: path.startsWith("/api/") ? path : `/api/v1${path}`,
          method: "POST",
          data: { secret: "auth" },
        }),
      ),
    )
    onProgress?.(Math.min(i + batchSize, urls.length), urls.length)
  }
}

export async function calculateRankingBatches(
  rankingId: string,
  eventId: string,
  stageId: string,
  onProgress?: RankingComputeProgress,
): Promise<unknown> {
  const classes = await postListRankingComputeStage(
    rankingId,
    eventId,
    stageId,
    { classes: "all" },
    { only_class_list: "1" },
  )
  if (classes.data) {
    onProgress?.(0, classes.data.length)
    await postInBatches(classes.data, 1, onProgress)
  }
  return classes
}
