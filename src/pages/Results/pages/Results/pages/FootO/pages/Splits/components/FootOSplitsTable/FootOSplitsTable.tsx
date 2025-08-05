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
} from "./shared/footOSplitsTablefunctions.ts"
import CourseControlTableHeader from "./components/CourseControlTableHeader.tsx"
import NowProvider from "../../../../../../../../components/NowProvider.tsx"
import { OnlineControlModel } from "../../../../../../../../../../shared/EntityTypes.ts"
import { hasChipDownload } from "../../../../../../shared/functions.ts"
import NoRunnerWithSplitsMsg from "./components/NoRunnerWithSplitsMsg.tsx"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { analyzeTimeLoss, TimeLossResults } from "../utils/timeLossAnalysis.ts"

type FootOSplitsTableProps = {
  runners: ProcessedRunnerModel[]
  onlyRadios?: boolean
  showCumulative?: boolean
  radiosList: OnlineControlModel[]
  timeLossEnabled?: boolean
  timeLossThreshold?: number
  timeLossResults?: TimeLossResults | null
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

  const isSyncingRef = useRef(false)
  const headerRef = useRef<HTMLDivElement | null>(null)
  const bodyRef = useRef<HTMLDivElement | null>(null)
  const scrollTrackRef = useRef<HTMLDivElement | null>(null)
  const scrollThumbRef = useRef<HTMLDivElement | null>(null)
  const observer = useRef<ResizeObserver | null>(null)
  const [thumbWidth, setThumbWidth] = useState(20)
  const [scrollStartPosition, setScrollStartPosition] = useState<number | null>(null)
  const [initialScrollLeft, setInitialScrollLeft] = useState<number>(0)
  const [isDragging, setIsDragging] = useState(false)

  const handleThumbPosition = useCallback(() => {
    if (!bodyRef.current || !scrollTrackRef.current || !scrollThumbRef.current) {
      return
    }

    const { scrollLeft: contentLeft, scrollWidth: contentWidth } = bodyRef.current
    const { clientWidth: trackWidth } = scrollTrackRef.current
    let newLeft = (contentLeft / contentWidth) * trackWidth
    newLeft = Math.min(newLeft, trackWidth - thumbWidth)

    scrollThumbRef.current.style.left = `${newLeft}px`
  }, [thumbWidth])

  const handleBodyScroll = useCallback(() => {
    if (isSyncingRef.current) return

    if (headerRef.current && bodyRef.current) {
      isSyncingRef.current = true
      headerRef.current.scrollLeft = bodyRef.current.scrollLeft
      handleThumbPosition()
      // Allow a short delay before unlocking syncing
      requestAnimationFrame(() => {
        isSyncingRef.current = false
      })
    }
  }, [handleThumbPosition])

  const handleHeaderScroll = useCallback(() => {
    if (isSyncingRef.current) return

    if (headerRef.current && bodyRef.current) {
      isSyncingRef.current = true
      bodyRef.current.scrollLeft = headerRef.current.scrollLeft
      handleThumbPosition()
      requestAnimationFrame(() => {
        isSyncingRef.current = false
      })
    }
  }, [handleThumbPosition])

  useEffect(() => {
    const bodyDiv = bodyRef.current
    const trackDiv = scrollTrackRef.current
    const headerDiv = headerRef.current

    if (!bodyDiv || !headerDiv || !trackDiv) return

    const updateThumbSize = () => {
      const trackSize = trackDiv.clientWidth
      const { clientWidth, scrollWidth } = bodyDiv
      const calculatedThumbWidth = Math.max((clientWidth / scrollWidth) * trackSize, 20)
      setThumbWidth(calculatedThumbWidth)
    }

    observer.current = new ResizeObserver(() => {
      updateThumbSize()
      handleThumbPosition()
    })

    observer.current.observe(bodyDiv)
    observer.current.observe(trackDiv)

    bodyDiv.addEventListener("scroll", handleBodyScroll)
    headerDiv.addEventListener("scroll", handleHeaderScroll)

    // Initial call
    updateThumbSize()
    handleThumbPosition()

    return () => {
      observer.current?.disconnect()
      bodyDiv.removeEventListener("scroll", handleBodyScroll)
      headerDiv.removeEventListener("scroll", handleHeaderScroll)
    }
  }, [handleThumbPosition, handleBodyScroll, handleHeaderScroll])

  const handleTrackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      const { current: trackCurrent } = scrollTrackRef
      const { current: contentCurrent } = bodyRef
      const { current: headerCurrent } = headerRef
      if (trackCurrent && contentCurrent && headerCurrent) {
        // First, figure out where we clicked
        const { clientX } = e
        // Next, figure out the distance between the top of the track and the top of the viewport
        const target = e.target as HTMLDivElement
        const rect = target.getBoundingClientRect()
        const trackLeft = rect.left
        // We want the middle of the thumb to jump to where we clicked, so we subtract half the thumb's height to offset the position
        const thumbOffset = -(thumbWidth / 2)
        // Find the ratio of the new position to the total content length using the thumb and track values...
        const clickRatio = (clientX - trackLeft + thumbOffset) / trackCurrent.clientWidth
        // ...so that you can compute where the content should scroll to.
        const scrollAmount = Math.floor(clickRatio * contentCurrent.scrollWidth)
        // And finally, scroll to the new position!
        contentCurrent.scrollTo({
          left: scrollAmount,
          behavior: "smooth",
        })
        headerCurrent.scrollTo({
          left: scrollAmount,
          behavior: "smooth",
        })
      }
    },
    [thumbWidth],
  )

  const handleThumbMousedown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setScrollStartPosition(e.clientX)
    if (bodyRef.current) setInitialScrollLeft(bodyRef.current.scrollLeft)
    if (headerRef.current) setInitialScrollLeft(headerRef.current.scrollLeft)
    setIsDragging(true)
  }, [])

  const handleThumbMouseup = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (isDragging) {
        setIsDragging(false)
      }
    },
    [isDragging],
  )

  const handleThumbMousemove = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (isDragging) {
        const { scrollWidth: contentScrollWidth, offsetWidth: contentOffsetWidth } =
          bodyRef.current!

        const deltaX = (e.clientX - scrollStartPosition!) * (contentOffsetWidth / thumbWidth)
        const newScrollLeft = Math.min(
          initialScrollLeft + deltaX,
          contentScrollWidth - contentOffsetWidth,
        )

        bodyRef.current!.scrollLeft = newScrollLeft
        headerRef.current!.scrollLeft = newScrollLeft
      }
    },
    [isDragging, scrollStartPosition, thumbWidth, initialScrollLeft],
  )

  // Listen for mouse events to handle scrolling by dragging the thumb
  useEffect(() => {
    document.addEventListener("mousemove", handleThumbMousemove)
    document.addEventListener("mouseup", handleThumbMouseup)
    document.addEventListener("mouseleave", handleThumbMouseup)
    return () => {
      document.removeEventListener("mousemove", handleThumbMousemove)
      document.removeEventListener("mouseup", handleThumbMouseup)
      document.removeEventListener("mouseleave", handleThumbMouseup)
    }
  }, [handleThumbMousemove, handleThumbMouseup])

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
  }, [])

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

        <Box
          key="ScrollBar"
          sx={{ display: "block", width: "100%", height: "8px", position: "relative" }}
        >
          <Box
            ref={scrollTrackRef}
            onClick={handleTrackClick}
            key="ScrollBarTrack"
            sx={{
              cursor: isDragging ? "grabbing" : "pointer",
              position: "absolute",
              left: 0,
              right: 0,
              height: "8px",
              backgroundColor: "#EFEFEF",
            }}
          ></Box>
          <Box
            ref={scrollThumbRef}
            onMouseDown={handleThumbMousedown}
            key="ScrollBarThumb"
            sx={{
              cursor: isDragging ? "grabbing" : "grab",
              position: "absolute",
              height: "8px",
              backgroundColor: "#5E2572",
              width: `${thumbWidth}px`,
            }}
          ></Box>
        </Box>
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
