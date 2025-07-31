import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"
import { useTranslation } from "react-i18next"
import RunnerRow from "./components/RunnerRow.tsx"
import {
  CourseControlModel,
  getCourseFromRunner,
  getOnlineControlsCourseFromClassSplits,
} from "./shared/footOSplitsTablefunctions.ts"
import CourseControlTableHeader from "./components/CourseControlTableHeader.tsx"
import NowProvider from "../../../../../../../../components/NowProvider.tsx"
import { OnlineControlModel } from "../../../../../../../../../../shared/EntityTypes.ts"
import { hasChipDownload } from "../../../../../../shared/functions.ts"
import NoRunnerWithSplitsMsg from "./components/NoRunnerWithSplitsMsg.tsx"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { analyzeTimeLoss, TimeLossResults } from "../utils/timeLossAnalysis.ts"

type FootOSplitsTableProps = {
  runners: ProcessedRunnerModel[]
  onlyRadios?: boolean
  showCumulative?: boolean
  radiosList: OnlineControlModel[]
  timeLossEnabled?: boolean
  timeLossThreshold?: number
  timeLossResults?: TimeLossResults | null
  graphsEnabled?: boolean
  selectedRunners?: string[]
  onRunnerSelectionChange?: (selectedRunners: string[]) => void
}

export default function FootOSplitsTable(props: FootOSplitsTableProps) {
  const { t } = useTranslation()
  const runnerList = props.onlyRadios ? props.runners : props.runners.filter(hasChipDownload)

  const onlineControlList = useMemo(
    () => getOnlineControlsCourseFromClassSplits(props.radiosList),
    [props.radiosList],
  )

  const courseControlList = useMemo(() => {
    return getCourseFromRunner(runnerList)
  }, [runnerList])

  const controlList = props.onlyRadios && props.radiosList ? onlineControlList : courseControlList

  const timeLossResults: TimeLossResults | null = useMemo(() => {
    if (!props.timeLossEnabled || props.onlyRadios || !props.timeLossThreshold) {
      return null
    }
    return analyzeTimeLoss(runnerList, props.timeLossThreshold, props.showCumulative)
  }, [
    props.timeLossEnabled,
    props.onlyRadios,
    props.timeLossThreshold,
    runnerList,
    props.showCumulative,
  ])

  if (runnerList.length === 0) {
    return <NoRunnerWithSplitsMsg />
  }

  const showTimeLossColumn = props.timeLossEnabled && !props.showCumulative

  const canSelectRunner = (runner: ProcessedRunnerModel): boolean => {
    return !!runner.stage
  }

  const selectedRunners = props.selectedRunners || []
  const selectableRunners = runnerList.filter(canSelectRunner)
  const isAllSelected =
    selectedRunners.length === selectableRunners.length && selectableRunners.length > 0
  const isIndeterminate =
    selectedRunners.length > 0 && selectedRunners.length < selectableRunners.length

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allRunnerIds = selectableRunners.map((runner) => runner.id)
      props.onRunnerSelectionChange?.(allRunnerIds)
    } else {
      props.onRunnerSelectionChange?.([])
    }
  }

  const handleRunnerSelection = (runnerId: string, checked: boolean) => {
    const currentSelection = props.selectedRunners || []
    if (checked) {
      props.onRunnerSelectionChange?.([...currentSelection, runnerId])
    } else {
      props.onRunnerSelectionChange?.(currentSelection.filter((id) => id !== runnerId))
    }
  }

  const headerRef = useRef<HTMLDivElement | null>(null)
  const bodyRef = useRef<HTMLDivElement | null>(null)
  const [colWidths, setColWidths] = useState<number[]>([])

  useEffect(() => {
    const bodyDiv = bodyRef.current
    const headerDiv = headerRef.current
    if (!bodyDiv || !headerDiv) return

    let isSyncing = false

    const syncHeaderScroll = () => {
      if (isSyncing) return
      isSyncing = true
      headerDiv.scrollLeft = bodyDiv.scrollLeft
      isSyncing = false
    }

    const syncBodyScroll = () => {
      if (isSyncing) return
      isSyncing = true
      bodyDiv.scrollLeft = headerDiv.scrollLeft
      isSyncing = false
    }

    bodyDiv.addEventListener("scroll", syncHeaderScroll)
    headerDiv.addEventListener("scroll", syncBodyScroll)

    return () => {
      bodyDiv.removeEventListener("scroll", syncHeaderScroll)
      headerDiv.removeEventListener("scroll", syncBodyScroll)
    }
  }, [])

  useEffect(() => {
    if (!bodyRef.current) return

    const firstBodyRow = bodyRef.current.querySelectorAll("tr")[1]
    if (!firstBodyRow) return

    const widths = Array.from(firstBodyRow.children).map((cell) => {
      const style = window.getComputedStyle(cell)
      const width = cell.getBoundingClientRect().width
      const paddingLeft = parseFloat(style.paddingLeft)
      const paddingRight = parseFloat(style.paddingRight)
      return width - paddingLeft - paddingRight
    })
    setColWidths(widths)
  }, [])

  return (
    <NowProvider>
      {/* Header for the splits table */}
      <TableContainer
        component={Paper}
        ref={headerRef}
        key="SplitsTableHeaderContainer"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#EFEFEF",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#5E2572",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#5E2572",
          },
        }}
      >
        <Table size="small" key="SplitsTableHeader" sx={{ backgroundColor: "grey" }}>
          <TableHead key="TableHead">
            <TableRow key="tableHeadRow">
              {props.graphsEnabled && (
                <TableCell
                  key="selection"
                  padding="checkbox"
                  sx={colWidths[0] ? { width: colWidths[0] } : {}}
                >
                  <Checkbox
                    indeterminate={isIndeterminate}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    color="primary"
                  />
                </TableCell>
              )}
              <TableCell
                key="Time"
                sx={{
                  ...(colWidths[props.graphsEnabled ? 1 : 0]
                    ? { width: colWidths[props.graphsEnabled ? 1 : 0] }
                    : {}),
                }}
              >
                {t("ResultsStage.Times")}
              </TableCell>
              {showTimeLossColumn && (
                <TableCell
                  key="CleanTime"
                  sx={{
                    fontWeight: "bold",
                    ...(colWidths[props.graphsEnabled ? 2 : 1]
                      ? { width: colWidths[props.graphsEnabled ? 2 : 1] }
                      : {}),
                  }}
                >
                  {t("ResultsStage.SplitsTable.CleanTime")}
                </TableCell>
              )}
              {controlList.map((courseControl, idx) => {
                // Calculate the correct index for colWidths
                const baseIdx =
                  (props.graphsEnabled ? 1 : 0) +
                  1 + // Time column
                  (showTimeLossColumn ? 1 : 0)
                const colIdx = baseIdx + idx

                if (props.onlyRadios) {
                  const radio = courseControl as OnlineControlModel
                  return (
                    <CourseControlTableHeader
                      key={`courseControlHeader${radio.id}`}
                      station={radio.station}
                      onlyRadios={props.onlyRadios}
                      colWidth={colWidths[colIdx]}
                    />
                  )
                } else {
                  const course = courseControl as CourseControlModel
                  return (
                    <CourseControlTableHeader
                      key={`courseControlHeader${course.order_number}${course.control?.id ?? "unknown"}`}
                      station={course.control?.station}
                      order_number={course.order_number}
                      onlyRadios={props.onlyRadios}
                      colWidth={colWidths[colIdx]}
                    />
                  )
                }
              })}
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>

      {/* Table body */}
      <TableContainer
        component={Paper}
        ref={bodyRef}
        key="SplitsTableBodyContainer"
        sx={{ scrollbarWidth: "none" }}
      >
        <Table size="small" key="SplitsTableBody">
          <TableBody key="TableBody">
            {runnerList.map((runner) => (
              <RunnerRow
                key={`runnerRow${runner.id}`}
                runner={runner}
                showCumulative={props.showCumulative}
                onlyRadios={props.onlyRadios}
                radiosList={props.radiosList}
                timeLossResults={timeLossResults}
                timeLossEnabled={props.timeLossEnabled}
                graphsEnabled={props.graphsEnabled}
                selected={selectedRunners.includes(runner.id)}
                onSelectionChange={handleRunnerSelection}
                canSelect={canSelectRunner(runner)}
                maxRunnersReached={false}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </NowProvider>
  )
}
