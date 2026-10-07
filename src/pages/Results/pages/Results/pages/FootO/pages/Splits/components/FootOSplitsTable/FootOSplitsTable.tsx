import { ProcessedRunnerModel } from "../../../../../../../../components/VirtualTicket/shared/EntityTypes.ts"
import {
  Box,
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
} from "./shared/footOSplitsTableFunctions.ts"
import CourseControlTableHeader from "./components/CourseControlTableHeader.tsx"
import SplitsTableScrollbar from "./components/SplitsTableScrollbar.tsx"
import useSyncedHorizontalScroll from "./shared/useSyncedHorizontalScroll.ts"
import NowProvider from "../../../../../../components/NowProvider.tsx"
import { OnlineControlModel } from "../../../../../../../../../../shared/EntityTypes.ts"
import { hasChipDownload } from "../../../../../../shared/functions.ts"
import NoRunnerWithSplitsMsg from "../../../../components/NoRunnerWithSplitsMsg.tsx"
import { useEffect, useMemo, useState } from "react"
import { analyzeTimeLoss, TimeLossResults } from "../../../../shared/timeLossAnalysis.ts"
import { runnerService } from "../../../../../../../../../../domain/services/RunnerService.ts"

type FootOSplitsTableProps = {
  runners: ProcessedRunnerModel[]
  onlyRadios?: boolean
  showCumulative?: boolean
  radiosList: OnlineControlModel[]
  timeLossEnabled?: boolean
  timeLossThreshold?: number
}

export default function FootOSplitsTable(props: FootOSplitsTableProps) {
  const { t } = useTranslation()
  const runnerList = props.onlyRadios
    ? props.runners.filter((runner) => !runnerService.isDNS(runner))
    : props.runners.filter((runner) => hasChipDownload(runner) && !runnerService.isDNS(runner))

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
    return analyzeTimeLoss(runnerList, props.timeLossThreshold)
  }, [props.timeLossEnabled, props.onlyRadios, props.timeLossThreshold, runnerList])

  const { firstScrollerRef: headerRef, secondScrollerRef: bodyRef } = useSyncedHorizontalScroll<
    HTMLDivElement,
    HTMLDivElement
  >()

  const [colsWidth, setColWidths] = useState<number[]>([])
  useEffect(() => {
    if (!bodyRef.current || !headerRef.current) return

    const getWidths = (row: HTMLTableRowElement | undefined): number[] => {
      if (!row) return []
      return Array.from(row.children).map((cell) => {
        const style = window.getComputedStyle(cell)
        const width = cell.getBoundingClientRect().width
        const paddingLeft = parseFloat(style.paddingLeft)
        const paddingRight = parseFloat(style.paddingRight)
        return width - paddingLeft - paddingRight
      })
    }

    const bodyRow = bodyRef.current.querySelectorAll("tr")[1] as HTMLTableRowElement | undefined
    const headerRow = headerRef.current.querySelector("tr") as HTMLTableRowElement | undefined

    const bodyWidths = getWidths(bodyRow)
    const headerWidths = getWidths(headerRow)

    const maxWidths = bodyWidths.map((width, index) => {
      return Math.max(width, headerWidths[index])
    })

    setColWidths(maxWidths)
  }, [bodyRef, headerRef])

  if (runnerList.length === 0) {
    return <NoRunnerWithSplitsMsg />
  }

  const showTimeLossColumn = props.timeLossEnabled && !props.showCumulative

  return (
    <NowProvider>
      {/* Header for the splits table */}
      <Box sx={{ position: "sticky", top: 0, zIndex: 1 }}>
        <TableContainer
          component={Box}
          ref={headerRef}
          key="SplitsTableHeaderContainer"
          sx={{
            scrollbarWidth: "none",
          }}
        >
          <Table size="small" key="SplitsTableHeader" sx={{ backgroundColor: "white" }}>
            <TableHead key="TableHead">
              <TableRow
                key="tableHeadRow"
                sx={{
                  "&:before": {
                    content: '""',
                    display: "block",
                    width: "16px",
                  },
                  "&:after": {
                    content: '""',
                    display: "block",
                    width: "16px",
                  },
                }}
              >
                <TableCell
                  key="Time"
                  sx={{
                    border: "none",
                    py: "10px",
                    px: "16px",
                    minWidth: colsWidth[0],
                  }}
                >
                  {t("ResultsStage.Times")}
                </TableCell>
                {showTimeLossColumn && (
                  <TableCell
                    key="CleanTime"
                    sx={{
                      fontWeight: "bold",
                      border: "none",
                      py: "10px",
                      px: "8px",
                      minWidth: colsWidth[1],
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t("ResultsStage.SplitsTable.CleanTime")}
                  </TableCell>
                )}
                {controlList.map((courseControl, idx) => {
                  // Calculate the correct index for colWidths
                  const baseIdx =
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
                        colWidth={colsWidth[colIdx]}
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
                        colWidth={colsWidth[colIdx]}
                      />
                    )
                  }
                })}
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>

        <SplitsTableScrollbar scrollerRef={bodyRef} />
      </Box>

      {/* Table body */}
      <TableContainer
        component={Box}
        ref={bodyRef}
        key="SplitsTableBodyContainer"
        sx={{ scrollbarWidth: "none", paddingBottom: "16px" }}
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
                colsWidth={colsWidth}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </NowProvider>
  )
}
