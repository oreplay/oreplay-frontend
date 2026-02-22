import { GridRowParams } from "@mui/x-data-grid"
import { StageRow } from "../pages/EventAdmin/pages/EventAdmin/components/StagesDataGrid.tsx"
import { t } from "i18next"
import { ShowNotification, CloseNotification } from "@toolpad/core"
import { Data } from "../../../shared/EntityTypes.ts"
import { ApiStats } from "../../../domain/models/ApiStats.ts"
import { post } from "../../../services/ApiConfig.ts"

export function postCreateOrganizer(
  eventId: string,
  stageId: string,
  runnerId: string,
  stageOrder: number,
  token: string,
) {
  const rankingId = currentRankingId()
  if (!rankingId || !eventId || !stageId || !stageOrder || !runnerId || !token) {
    throw new Error("All parameters are mandatory to set computable_org")
  }
  return post(
    `/rankings/${rankingId}/events/${eventId}/stages/${stageId}/runnerResults/`,
    {
      upload_type: "computable_org",
      runner_id: runnerId,
      stage_order: stageOrder,
    },
    token,
  )
}

export async function calculateRankingFull(
  rankingId: string,
  eventId: string,
  stageId: string,
  token: string,
): Promise<Data<ApiStats>> {
  return post(
    `/rankings/${rankingId}/events/${eventId}/stages/${stageId}/compute`,
    {
      classes: "all",
    },
    token,
  )
}

const postInBatches = async (classArray: string[], token: string, batchSize: number) => {
  for (let i = 0; i < classArray.length; i += batchSize) {
    const batch = classArray.slice(i, i + batchSize)

    const postPromises = batch.map((url) => post(url, { secret: "auth" }, token))

    // Wait for this batch to complete before continuing
    await Promise.all(postPromises)
  }
}

export async function calculateRankingBatches(
  rankingId: string,
  eventId: string,
  stageId: string,
  token: string,
): Promise<unknown> {
  const classes = await post(
    `/rankings/${rankingId}/events/${eventId}/stages/${stageId}/compute?only_class_list=1`,
    {
      classes: "all",
    },
    token,
  )
  // @ts-expect-error I dont want to add more types
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const classArray = classes && classes.data
  if (
    classArray &&
    Array.isArray(classArray) &&
    classArray.every((item) => typeof item === "string")
  ) {
    await postInBatches(classArray, token, 9)
  }
  return classes
}

export function currentRankingId() {
  return "regional100pts" // TODO change name
}

export async function handleRanking(
  row: GridRowParams<StageRow>,
  eventId: string,
  token: string,
  show: ShowNotification,
  close: CloseNotification,
) {
  const rankingId = currentRankingId()
  const resetNotification = show(t("Loading"), {
    autoHideDuration: 30000,
    severity: "info",
  })
  try {
    const res = await calculateRankingBatches(
      rankingId,
      eventId, // props.eventDetail.id,
      row.row.stageId,
      token,
    )
    console.log("xx ranking", res)
    close(resetNotification)
    show(t("Success"), {
      autoHideDuration: 1000,
      severity: "success",
    })
  } catch (e) {
    close(resetNotification)
    show("Error", {
      autoHideDuration: 1000,
      severity: "error",
    })
  }
}
