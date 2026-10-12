import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { GraphView } from "../shared/graphViews.ts"
import { useSelectedRunners } from "../shared/useSelectedRunners.ts"
import RunnerList from "./RunnerList/RunnerList.tsx"
import SelectedGraph from "./SelectedGraph.tsx"

interface GraphsViewContentProps {
  runners: ProcessedRunnerModel[]
  view: GraphView
}

/**
 * The graph and the list that picks the runners plotted in it. The list sits below the graph; on
 * wide screens it moves beside it, as tall as the graph and scrollable.
 *
 * @param props.runners Runners of the class.
 * @param props.view The graph to show.
 */
export default function GraphsViewContent({ runners, view }: GraphsViewContentProps) {
  const [selectedRunnerIds, setSelectedRunnerIds] = useSelectedRunners(runners)

  return (
    <div className="graphs-view-content flex flex-col gap-2 px-2 pb-4 lg:flex-row lg:items-start lg:gap-4">
      <div className="min-w-0 flex-1 lg:w-0">
        <SelectedGraph runners={runners} selectedRunnerIds={selectedRunnerIds} view={view} />
      </div>
      <RunnerList
        onSelectionChange={setSelectedRunnerIds}
        runners={runners}
        selectedRunnerIds={selectedRunnerIds}
        className="lg:max-h-[400px] lg:w-72 lg:shrink-0"
      />
    </div>
  )
}
