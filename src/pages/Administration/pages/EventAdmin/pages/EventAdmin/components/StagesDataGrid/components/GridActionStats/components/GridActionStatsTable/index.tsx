import { useTranslation } from "react-i18next"
import { useQuery } from "react-query"
import { StageStatsModel } from "../../../../../../../../../../../../domain/models/ApiStats.ts"
import { AxiosError } from "axios"
import { getStageStats } from "../../../../../../../../../../../../domain/services/StageStatsService.ts"
import GeneralErrorFallback from "../../../../../../../../../../../../components/GeneralErrorFallback.tsx"
import GeneralSuspenseFallback from "../../../../../../../../../../../../components/GeneralSuspenseFallback.tsx"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import GridActionStatsTableRow from "./components/GridActionStatsTableRow.tsx"
import { Data } from "../../../../../../../../../../../../shared/EntityTypes.ts"
import { ErrorBoundary } from "@sentry/react"

interface GridActionStatsModel {
  eventId: string
  stageId: string
  active?: boolean
}

export default function GridActionStatsTable({ eventId, stageId, active }: GridActionStatsModel) {
  const { t } = useTranslation()

  const statsQuery = useQuery<Data<StageStatsModel[]>, AxiosError<StageStatsModel[]>>(
    [eventId, stageId, "stats"],
    () => getStageStats(eventId, stageId),
    {
      enabled: active,
    },
  )

  // table
  if (statsQuery.isSuccess && statsQuery.data) {
    return (
      <ErrorBoundary fallback={<GeneralErrorFallback />}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell key={"head.classes"}>{t("Results.Classes")}</TableCell>
                <TableCell key={"head.ok"}>{t("ResultsStage.statusCodes.ok")}</TableCell>
                <TableCell key={"head.mp"}>{t("ResultsStage.statusCodes.mp")}</TableCell>
                <TableCell key={"head.dnf"}>{t("ResultsStage.statusCodes.dnf")}</TableCell>
                <TableCell key={"head.ot"}>{t("ResultsStage.statusCodes.ot")}</TableCell>
                <TableCell key={"head.dsq"}>{t("ResultsStage.statusCodes.dsq")}</TableCell>
                <TableCell key={"head.dns"}>{t("ResultsStage.statusCodes.dns")}</TableCell>
                <TableCell key={"head.TotalRunners"}>
                  {t("EventAdmin.Stages.Stats.TotalRunners")}
                </TableCell>
                <TableCell key={"head.BestTime"}>{t("EventAdmin.Stages.Stats.BestTime")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {statsQuery.data.data.map((classStats) => (
                <GridActionStatsTableRow data={classStats} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ErrorBoundary>
    )
  }

  // Loading state
  if (statsQuery.isLoading) {
    return <GeneralSuspenseFallback />
  }

  // Error state
  if (statsQuery.isError) {
    return <GeneralErrorFallback />
  }
}
