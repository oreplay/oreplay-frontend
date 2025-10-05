import { StageStatsModel } from "../../../../../../../../../../../../../domain/models/ApiStats.ts"
import { TableCell, TableRow } from "@mui/material"
import { parseSecondsToMMSS } from "../../../../../../../../../../../../../shared/Functions.tsx"

export default function GridActionStatsTableRow({ data }: { data: StageStatsModel }) {
  return (
    <TableRow>
      <TableCell key={"class"}>{data.class}</TableCell>
      <TableCell key={"ok"}>{data.ok}</TableCell>
      <TableCell key={"mp"}>{data.mp}</TableCell>
      <TableCell key={"dnf"}>{data.dnf}</TableCell>
      <TableCell key={"ot"}>{data.ot}</TableCell>
      <TableCell key={"dsq"}>{data.dsq}</TableCell>
      <TableCell key={"dns"}>{data.dns}</TableCell>
      <TableCell key={"total"}>{data.total}</TableCell>
      <TableCell key={"bestTime"}>{parseSecondsToMMSS(data.bestTime)}</TableCell>
    </TableRow>
  )
}
