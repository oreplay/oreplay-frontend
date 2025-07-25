import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { RESULT_STATUS_TEXT } from "../../../../../../../../shared/constants.ts"
import { parseResultStatus } from "../../../../../../../../shared/sortingFunctions/sortRunners.ts"

export interface TimeLossAnalysis {
  controlId: string
  orderNumber: number
  bestTime: number
  estimatedTimeWithoutError: number
  runnerAnalysis: Map<string, RunnerTimeLossInfo>
}

export interface RunnerTimeLossInfo {
  hasTimeLoss: boolean
  splitTime: number
  isTopThree: boolean
  isBest: boolean
  position: number
  rank: number
}

export interface TimeLossResults {
  analysisPerControl: Map<string, TimeLossAnalysis>
  globalStats: {
    totalControls: number
    totalSplitsAnalyzed: number
    totalTimeLossDetected: number
  }
}

/**
 * Maps an input threshold to an adjusted threshold value.
 * For example, if input is 20, returns 5; if 25, returns 10;
 * otherwise subtracts 15 from input.
 */
function mapThreshold(input: number): number {
  if (input === 20) return 5
  if (input === 25) return 10
  return input - 15
}

/**
 * Main function to analyze time loss of runners on each control.
 *
 * @param runners - array of runner data to analyze
 * @param threshold - threshold percentage to determine significant time loss
 * @param showCumulative - if true, analyze cumulative times instead of split times
 * @returns aggregated time loss analysis results with stats
 */
export function analyzeTimeLoss(
  runners: ProcessedRunnerModel[],
  threshold: number,
  showCumulative: boolean = false,
): TimeLossResults {
  // Adjust the threshold according to mapping rules
  const effectiveThreshold = mapThreshold(threshold)

  // Map to hold analysis results keyed by control ID
  const analysisPerControl = new Map<string, TimeLossAnalysis>()
  let totalSplitsAnalyzed = 0
  let totalTimeLossDetected = 0

  // Filter out runners with non-competitive status (e.g., NC - No Competition)
  const validRunners = runners.filter((runner) => {
    const status = parseResultStatus(runner.stage.status_code as string)
    return status !== RESULT_STATUS_TEXT.nc
  })

  // If no valid runners, return empty analysis with zero stats
  if (validRunners.length === 0) {
    return {
      analysisPerControl,
      globalStats: {
        totalControls: 0,
        totalSplitsAnalyzed: 0,
        totalTimeLossDetected: 0,
      },
    }
  }

  // Collect all unique control IDs from runners' splits
  const allControls = new Set<string>()
  validRunners.forEach((runner) => {
    runner.stage.splits.forEach((split) => {
      if (split.control?.id) {
        allControls.add(split.control.id)
      }
    })
  })

  // Perform time loss analysis for each control separately
  allControls.forEach((controlId) => {
    const controlAnalysis = analyzeControlTimeLoss(
      validRunners,
      controlId,
      effectiveThreshold,
      showCumulative,
    )

    // If analysis was successful, store it and update global stats
    if (controlAnalysis) {
      analysisPerControl.set(controlId, controlAnalysis)
      totalSplitsAnalyzed += controlAnalysis.runnerAnalysis.size

      controlAnalysis.runnerAnalysis.forEach((info) => {
        if (info.hasTimeLoss) {
          totalTimeLossDetected++
        }
      })
    }
  })

  // Return full analysis including per-control data and overall statistics
  return {
    analysisPerControl,
    globalStats: {
      totalControls: analysisPerControl.size,
      totalSplitsAnalyzed,
      totalTimeLossDetected,
    },
  }
}

/**
 * Detects internal time loss for a single runner on all splits.
 * This function compares the runner's split times against other runners'
 * and uses threshold percentages to identify potential time losses.
 * It includes special handling for the first split compared to average.
 *
 * @param runner - runner to analyze
 * @param thresholdPercent - threshold percentage to detect time loss
 * @param showCumulative - whether to use cumulative time instead of split time
 * @param allRunners - all runners to compute averages and comparisons
 * @returns a Map of controlId to boolean indicating if time loss was detected internally
 */
function detectInternalTimeLossForRunner(
  runner: ProcessedRunnerModel,
  thresholdPercent: number,
  showCumulative: boolean,
  allRunners: ProcessedRunnerModel[],
): Map<string, boolean> {
  const internalLossMap = new Map<string, boolean>()

  // Sort splits by their order number
  const splits = runner.stage.splits
    .filter((s) => s.control?.id)
    .sort((a, b) => (a.order_number ?? 0) - (b.order_number ?? 0))

  // Calculate the average time of the first split among all runners
  const firstSplitTimes: number[] = []
  allRunners.forEach((r) => {
    const firstSplit = r.stage.splits.find((s) => (s.order_number ?? 0) === 1)
    if (firstSplit) {
      const time = showCumulative ? firstSplit.cumulative_time : firstSplit.time
      if (time !== null) {
        firstSplitTimes.push(time)
      }
    }
  })

  const avgFirstSplitTime =
    firstSplitTimes.length > 0
      ? firstSplitTimes.reduce((a, b) => a + b, 0) / firstSplitTimes.length
      : null

  // Analyze the first split of the runner vs. average first split time
  if (splits.length > 0 && avgFirstSplitTime !== null) {
    const firstSplit = splits[0]
    const firstSplitTime = showCumulative ? firstSplit.cumulative_time : firstSplit.time
    if (firstSplitTime !== null) {
      const diffPercentFirst = ((firstSplitTime - avgFirstSplitTime) / avgFirstSplitTime) * 100
      internalLossMap.set(firstSplit.control!.id, diffPercentFirst > thresholdPercent)
    }
  }

  // For later splits, analyze time loss using internal logic
  const splitTimes = splits
    .map((s) => (showCumulative ? s.cumulative_time : s.time))
    .filter((t): t is number => t !== null)

  for (let i = 1; i < splits.length; i++) {
    const prevSplit = splits[i - 1]
    const currentSplit = splits[i]

    if (!prevSplit.control || !currentSplit.control) continue

    const prevTime = showCumulative ? prevSplit.cumulative_time : prevSplit.time
    const currTime = showCumulative ? currentSplit.cumulative_time : currentSplit.time

    if (prevTime === null || currTime === null) continue

    // Calculate average excluding current split time
    const timesExcludingCurrent = splitTimes.filter((t) => t !== currTime)
    const avgTime = timesExcludingCurrent.reduce((a, b) => a + b, 0) / timesExcludingCurrent.length

    // Calculate percentage differences to detect time loss
    const diffPercentInternal = ((currTime - avgTime) / avgTime) * 100
    const diffPercentConsecutive = ((currTime - prevTime) / prevTime) * 100

    // Set time loss if both differences exceed a threshold
    if (diffPercentInternal > thresholdPercent && diffPercentConsecutive > thresholdPercent) {
      internalLossMap.set(currentSplit.control.id, true)
    } else {
      if (!internalLossMap.has(currentSplit.control.id)) {
        internalLossMap.set(currentSplit.control.id, false)
      }
    }
  }

  return internalLossMap
}

/**
 * Performs time loss analysis for a specific control by comparing
 * the runners' split times and detecting which runners have significant time losses.
 *
 * @param runners - array of runners to analyze
 * @param controlId - control ID to analyze
 * @param threshold - threshold percentage for time loss detection
 * @param showCumulative - whether to use cumulative time or split time
 * @returns TimeLossAnalysis object or null of insufficient data
 */
function analyzeControlTimeLoss(
  runners: ProcessedRunnerModel[],
  controlId: string,
  threshold: number,
  showCumulative: boolean,
): TimeLossAnalysis | null {
  // Extraemos los splits para este control de todos los corredores
  const controlSplits: Array<{
    runnerId: string
    splitTime: number
    orderNumber: number
    position: number
    splitIndex: number // índice del split dentro de runner.stage.splits
  }> = []

  runners.forEach((runner) => {
    const splits = runner.stage.splits
    const splitIndex = splits.findIndex((s) => s.control?.id === controlId)
    if (splitIndex >= 0) {
      const split = splits[splitIndex]
      const splitTime = showCumulative ? split.cumulative_time : split.time
      const position = showCumulative ? split.cumulative_position : split.position

      if (splitTime !== null && splitTime > 0 && position !== null) {
        controlSplits.push({
          runnerId: runner.id,
          splitTime,
          orderNumber: split.order_number || 0,
          position,
          splitIndex,
        })
      }
    }
  })

  if (controlSplits.length < 2) {
    return null // No hay datos suficientes para analizar
  }

  // Ordenamos los splits por tiempo para identificar el mejor
  controlSplits.sort((a, b) => a.splitTime - b.splitTime)

  const bestTime = controlSplits[0].splitTime

  // Umbral de corte para considerar "sin error"
  const thresholdTime = bestTime * (1.5 + threshold / 100)

  // Filtramos splits sin error externo (con tiempo dentro del umbral)
  const noErrorSplits = controlSplits.filter((split) => split.splitTime <= thresholdTime)
  if (noErrorSplits.length === 0) return null

  // Calculamos la media de diferencia porcentual con respecto al mejor tiempo
  const totalDiffPercentage = noErrorSplits.reduce((sum, split) => {
    return sum + ((split.splitTime - bestTime) / bestTime) * 100
  }, 0)

  const md = totalDiffPercentage / noErrorSplits.length
  const estimatedTimeWithoutError = ((100 + md) / 100) * bestTime

  // --- Cálculo de ritmo esperado para este tramo ---

  // Para cada corredor, calculamos el tiempo del tramo (split actual - split anterior)
  // y sacamos el promedio (ritmo esperado)
  const tramoTimes: number[] = []

  runners.forEach((runner) => {
    const splits = runner.stage.splits
    const idx = splits.findIndex((s) => s.control?.id === controlId)

    if (idx > 0) {
      // Tiene split anterior para calcular tramo
      const currentSplit = splits[idx]
      const prevSplit = splits[idx - 1]

      const currentTime = showCumulative ? currentSplit.cumulative_time : currentSplit.time
      const prevTime = showCumulative ? prevSplit.cumulative_time : prevSplit.time

      if (currentTime !== null && prevTime !== null) {
        const tramoTime = currentTime - prevTime
        if (tramoTime > 0) tramoTimes.push(tramoTime)
      }
    }
  })

  if (tramoTimes.length === 0) return null // No se puede calcular ritmo esperado

  // Ritmo esperado = promedio de los tiempos de tramo de todos los corredores
  const ritmoEsperado = tramoTimes.reduce((a, b) => a + b, 0) / tramoTimes.length

  // Ahora construimos el análisis por corredor
  const runnerAnalysis = new Map<string, RunnerTimeLossInfo>()

  controlSplits.forEach((split, index) => {
    const runner = runners.find((r) => r.id === split.runnerId)
    if (!runner) return

    // Obtenemos el split actual y el anterior para el cálculo de ritmo real
    const splits = runner.stage.splits
    const idx = split.splitIndex

    let ritmoReal = null
    if (idx > 0) {
      const currentSplit = splits[idx]
      const prevSplit = splits[idx - 1]

      const currentTime = showCumulative ? currentSplit.cumulative_time : currentSplit.time
      const prevTime = showCumulative ? prevSplit.cumulative_time : prevSplit.time

      if (currentTime !== null && prevTime !== null) {
        ritmoReal = currentTime - prevTime
      }
    }

    // Cálculo de diferencias
    const diffSeconds = split.splitTime - estimatedTimeWithoutError
    const diffPercent = (diffSeconds / estimatedTimeWithoutError) * 100

    // Pérdida de tiempo externa basada en tiempo total
    const externalTimeLossBase = diffSeconds > 0 && (diffSeconds > 30 || diffPercent > threshold)

    // Pérdida de tiempo por ritmo (solo si podemos calcular ritmo real)
    const externalTimeLossRitmo =
      ritmoReal !== null && ritmoReal > ritmoEsperado * (1 + threshold / 100)

    // Pérdida de tiempo externa definitiva (requiere que se cumpla alguna condición)
    const externalTimeLoss = externalTimeLossBase || externalTimeLossRitmo

    // Comprobamos también pérdida interna como antes
    const internalTimeLossByRunner = new Map<string, Map<string, boolean>>()
    runners.forEach((r) => {
      const internalMap = detectInternalTimeLossForRunner(r, threshold, showCumulative, runners)
      internalTimeLossByRunner.set(r.id, internalMap)
    })
    const internalMap = internalTimeLossByRunner.get(split.runnerId)
    const internalTimeLoss = internalMap?.get(controlId) || false

    // Consideramos pérdida solo si ambas condiciones (interna y externa) se cumplen
    const hasTimeLoss = externalTimeLoss && internalTimeLoss

    runnerAnalysis.set(split.runnerId, {
      hasTimeLoss,
      splitTime: split.splitTime,
      isBest: index === 0,
      isTopThree: index < 3,
      position: split.position,
      rank: index + 1,
    })
  })

  return {
    controlId,
    orderNumber: controlSplits[0].orderNumber,
    bestTime,
    estimatedTimeWithoutError,
    runnerAnalysis,
  }
}

/**
 * Retrieves the time loss information for a specific runner at a specific control
 * from the overall analysis results.
 *
 * @param timeLossResults - the full time loss analysis results
 * @param runnerId - ID of the runner
 * @param controlId - ID of the control
 * @returns RunnerTimeLossInfo object or null if not found
 */
export function getRunnerTimeLossInfo(
  timeLossResults: TimeLossResults,
  runnerId: string,
  controlId: string,
): RunnerTimeLossInfo | null {
  const controlAnalysis = timeLossResults.analysisPerControl.get(controlId)
  if (!controlAnalysis) {
    return null
  }

  return controlAnalysis.runnerAnalysis.get(runnerId) || null
}
