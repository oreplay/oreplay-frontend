import { orvalAxiosInstance } from "../orval/orval-axios-instance.ts"
import { postListRankingComputeStage } from "../repositories/ranking-compute-stage/ranking-compute-stage.ts"

const postInBatches = async (urls: string[], batchSize: number) => {
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize)
    await Promise.all(
      batch.map((path) =>
        orvalAxiosInstance({
          // The returned URLs are relative and lack the `/api/v1` prefix the
          url: path.startsWith("/api/") ? path : `/api/v1${path}`,
          method: "POST",
          data: { secret: "auth" },
        }),
      ),
    )
  }
}

export async function calculateRankingBatches(
  rankingId: string,
  eventId: string,
  stageId: string,
): Promise<unknown> {
  const classes = await postListRankingComputeStage(
    rankingId,
    eventId,
    stageId,
    { classes: "all" },
    { only_class_list: "1" },
  )
  if (classes.data) {
    await postInBatches(classes.data, 1)
  }
  return classes
}
