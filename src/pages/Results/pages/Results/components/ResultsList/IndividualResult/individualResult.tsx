import { useTranslation } from "react-i18next"
import { hasChipDownload as hasChipDownloadFunction } from "../../../shared/functions.ts"
import ResultListItem from "../ResultListItem.tsx"
import ResultListItemColumn from "../ResultListItemColumn.tsx"
import RacePosition from "../../RacePosition..tsx"
import { Box } from "@mui/material"
import ParticipantName from "../../ParticipantName.tsx"
import { runnerService } from "../../../../../../../domain/services/RunnerService.ts"
import { ProcessedRunnerModel } from "../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { FunctionComponent } from "react"

export interface ResultColumnProps {
  runner: ProcessedRunnerModel
}

interface IndividualResultProps {
  runner: ProcessedRunnerModel
  isClass: boolean
  onClick?: (runner: ProcessedRunnerModel) => void
  ResultColumn: FunctionComponent<ResultColumnProps>
}

export default function IndividualResult({
  runner,
  isClass,
  onClick,
  ResultColumn,
}: IndividualResultProps) {
  const { t } = useTranslation()

  return (
    <ResultListItem key={runner.id} onClick={onClick ? () => onClick(runner) : undefined}>
      <ResultListItemColumn
        slotProps={{
          box: {
            alignItems: "flex-start",
            flexGrow: 1,
            display: "flex",
            flexDirection: "row",
            height: "100%",
          },
        }}
      >
        <RacePosition
          position={runner.overalls ? runner.overalls.overall.position : runner.stage.position}
          hasDownload={runner.overalls ? true : hasChipDownloadFunction(runner)}
          isNC={runnerService.isNC(runner)}
          slotProps={{ text: { marginRight: 1 } }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <ParticipantName
            name={runner.full_name}
            subtitle={
              isClass ? runnerService.getClubName(runner, t) : runnerService.getClassName(runner)
            }
          />
        </Box>
      </ResultListItemColumn>
      <ResultListItemColumn>
        <ResultColumn runner={runner} />
      </ResultListItemColumn>
    </ResultListItem>
  )
}
