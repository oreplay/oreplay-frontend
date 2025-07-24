import { useEffect } from "react"
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import { useTranslation } from "react-i18next"
import { ProcessedRunnerModel } from "../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import { formatTime } from "../../Splits/components/utils/chartDataTransform.ts"

interface CompactRunnerTableProps {
  runners: ProcessedRunnerModel[]
  selectedRunners: string[]
  onSelectionChange: (runnerIds: string[]) => void
}

export default function CompactRunnerTable({
  runners,
  selectedRunners,
  onSelectionChange,
}: CompactRunnerTableProps) {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  useEffect(() => {
    if (selectedRunners.length === 0 && runners.length > 0) {
      const initialSelection = runners.slice(0, 5).map((r) => r.id)
      onSelectionChange(initialSelection)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runners])

  const handleToggleRunner = (runnerId: string) => {
    const newSelection = selectedRunners.includes(runnerId)
      ? selectedRunners.filter((id) => id !== runnerId)
      : [...selectedRunners, runnerId]

    onSelectionChange(newSelection)
  }

  const handleSelectAll = () => {
    if (selectedRunners.length === runners.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(runners.map((runner) => runner.id))
    }
  }

  const isAllSelected = selectedRunners.length === runners.length
  const isIndeterminate = selectedRunners.length > 0 && selectedRunners.length < runners.length

  return (
    <Paper sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {t("Graphs.RunnerSelection")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("Graphs.SelectedCount", {
            count: selectedRunners.length,
            total: runners.length,
          })}
        </Typography>
      </Box>

      <TableContainer
        sx={{
          flex: 1,
          maxHeight: isMobile ? "150px" : "none",
          overflowY: isMobile ? "auto" : "visible",
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={isIndeterminate}
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  size="small"
                />
              </TableCell>
              <TableCell>{t("Results.Position")}</TableCell>
              <TableCell>{t("Results.Name")}</TableCell>
              <TableCell align="right">{t("Results.Time")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {runners.map((runner) => (
              <TableRow
                key={runner.id}
                hover
                selected={selectedRunners.includes(runner.id)}
                onClick={() => handleToggleRunner(runner.id)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedRunners.includes(runner.id)}
                    onChange={() => handleToggleRunner(runner.id)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {runner.stage.position || "-"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap>
                    {runner.full_name}
                  </Typography>
                  {runner.club && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      {runner.club.short_name}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontFamily="monospace">
                    {runner.stage.time_seconds ? formatTime(runner.stage.time_seconds) : "-"}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}
