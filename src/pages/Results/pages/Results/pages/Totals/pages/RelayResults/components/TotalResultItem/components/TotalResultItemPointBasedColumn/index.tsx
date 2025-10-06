import { ResultColumnProps } from "../../../../../../../../components/ResultsList/IndividualResult/individualResult.tsx"
import { Box, Typography } from "@mui/material"
import RacePoints from "./components/RacePoints"
import { ProcessedOverallModel } from "../../../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"

export default function TotalResultsItemPointBasedColumn(props: ResultColumnProps) {
  // @ts-expect-error total runners always have non-null overall
  const result: ProcessedOverallModel = props.runner.overalls?.overall

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
      <RacePoints displayStatus points={result.points_final} status={result.status_code} />
      {result.points_behind ? (
        <Typography sx={{ color: "primary.main", fontSize: 14 }}>{result.points_behind}</Typography>
      ) : null}
    </Box>
  )
}
