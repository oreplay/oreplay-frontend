import { getListResults } from "../../../../../infrastructure/repositories/results/results.ts"
import { ProgressReporter } from "../../../shared/progress.ts"
import { buildExportRunners, ClassResults, ExportRunner } from "./exportRunners.ts"

export interface ExportClass {
  id: string
  name: string
}

export async function collectTopRunners(
  eventId: string,
  stageId: string,
  classes: ExportClass[],
  topCount: number,
  onProgress?: ProgressReporter,
): Promise<ExportRunner[]> {
  const total = classes.length
  let completed = 0
  onProgress?.(0, total)

  const classResults: ClassResults[] = await Promise.all(
    classes.map(async (exportClass) => {
      const results = await getListResults(eventId, stageId, { class_id: exportClass.id })
      completed += 1
      onProgress?.(completed, total)
      return { className: exportClass.name, participants: results.data }
    }),
  )
  return buildExportRunners(classResults, topCount)
}
