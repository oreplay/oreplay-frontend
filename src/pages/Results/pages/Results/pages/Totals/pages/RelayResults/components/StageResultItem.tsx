import ResultListItem from "../../../../../../../components/ResultsList/ResultListItem.tsx"
import { ProcessedOverallModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { parseSecondsToMMSS } from "../../../../../../../../../shared/Functions.tsx"
import { Text } from "../../../../../../../../../components/core/Text.tsx"
import { View } from "../../../../../../../../../components/core/View.tsx"

type StageResultItemProps = {
  stage: ProcessedOverallModel
}

export default function StageResultItem({ stage }: StageResultItemProps) {
  const stageDescription = stage?.stage ? stage.stage.description : `Stage ${stage.stage_order}`

  return (
    <ResultListItem>
      <View className={"w-10 flex-col"}>
        <Text className={"text-sm text-tertiary"}>{`${stage.position}.`}</Text>
      </View>
      <View className={"grow text-end"}>
        <Text className={"text-sm"}>{stageDescription}</Text>
      </View>
      <View className={"grow text-end"}>
        <Text className={"text-sm text-tertiary"}>
          {stage.time_seconds ? parseSecondsToMMSS(stage.time_seconds) : ""}
        </Text>
        <Text className={"text-sm text-primary"}>{stage.points_final}</Text>
      </View>
    </ResultListItem>
  )
}
