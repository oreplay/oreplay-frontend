import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import { ProcessedRunnerModel } from "./EntityTypes.ts"

const STALE_TIME_MS = 60000

type FetchClass<Data> = (eventId: string, stageId: string, classId: string) => Promise<Data>

/**
 * Selector for a class request that already resolves to the runner list.
 *
 * @param runners Runners of the class.
 * @returns The same runners.
 */
export function selectRunnerList(runners: ProcessedRunnerModel[]): ProcessedRunnerModel[] {
  return runners
}

/**
 * Every runner of the class of the runner shown in a virtual ticket, so the ticket can show the
 * class size and the runner's complete result (a club list lacks the class-wide positions).
 *
 * It shares the query key of the results page's class list. In class view it only reads that
 * cached list and never refetches it, so the page's own data is left untouched; in club view it
 * fetches the class.
 *
 * @param runner Runner shown in the ticket; `null` while no ticket is open.
 * @param isClass Whether the results page lists a class, whose runners are then already cached.
 * @param fetchClass The result type's service that fetches the runners of a class.
 * @param selectRunners Picks the runner list out of what `fetchClass` resolves to.
 * @returns The runner with its class-wide result when found (else the runner as given), the class
 * runners (`null` while unknown), and the loading and error flags of the class request.
 */
export function useClassRunners<Data>(
  runner: ProcessedRunnerModel | null,
  isClass: boolean,
  fetchClass: FetchClass<Data>,
  selectRunners: (data: Data) => ProcessedRunnerModel[],
): {
  runner: ProcessedRunnerModel | null
  classRunners: ProcessedRunnerModel[] | null
  isLoading: boolean
  isError: boolean
} {
  const { eventId, stageId } = useParams()
  if (!eventId || !stageId) throw new Error("Missing event or stage ID")

  const { data, isLoading, isError } = useQuery<Data>(
    [eventId, stageId, "results", "classes", runner?.class.id],
    () => fetchClass(eventId, stageId, runner!.class.id),
    {
      enabled: !isClass && !!runner,
      refetchOnWindowFocus: false,
      staleTime: STALE_TIME_MS,
    },
  )

  const classRunners = data ? selectRunners(data) : null
  const classRunner = classRunners?.find((classMember) => classMember.id === runner?.id)

  return { runner: classRunner ?? runner, classRunners, isLoading, isError }
}
