import { RefObject } from "react"
import { Box } from "@mui/material"
import { MIN_SCROLLBAR_THUMB_WIDTH_PX } from "../shared/scrollbarMetrics.ts"
import {
  SCROLL_PROGRESS_CSS_VARIABLE,
  VISIBLE_RATIO_CSS_VARIABLE,
} from "../shared/trackScrollbarMetrics.ts"
import useScrollbar from "../shared/useScrollbar.ts"

const SCROLLBAR_HEIGHT = "8px"
const THUMB_WIDTH = `max(${MIN_SCROLLBAR_THUMB_WIDTH_PX}px, calc(var(${VISIBLE_RATIO_CSS_VARIABLE}, 1) * 100%))`
const THUMB_LEFT = `calc(var(${SCROLL_PROGRESS_CSS_VARIABLE}, 0) * (100% - ${THUMB_WIDTH}))`

type SplitsTableScrollbarProps = {
  scrollerRef: RefObject<HTMLElement | null>
}

export default function SplitsTableScrollbar({ scrollerRef }: SplitsTableScrollbarProps) {
  const scrollbar = useScrollbar(scrollerRef)

  return (
    <Box
      aria-hidden
      ref={scrollbar.scrollbarRef}
      sx={{ display: "block", width: "100%", height: SCROLLBAR_HEIGHT, position: "relative" }}
    >
      <Box
        onClick={scrollbar.scrollToTrackClick}
        sx={{
          cursor: "pointer",
          position: "absolute",
          left: 0,
          right: 0,
          height: SCROLLBAR_HEIGHT,
          backgroundColor: "#EFEFEF",
        }}
      />
      <Box
        ref={scrollbar.thumbRef}
        onPointerDown={scrollbar.startThumbDrag}
        onPointerMove={scrollbar.dragThumb}
        onPointerUp={scrollbar.endThumbDrag}
        onPointerCancel={scrollbar.endThumbDrag}
        onLostPointerCapture={scrollbar.endThumbDrag}
        sx={{
          cursor: "grab",
          position: "absolute",
          left: THUMB_LEFT,
          height: SCROLLBAR_HEIGHT,
          backgroundColor: "#5E2572",
          touchAction: "none",
          width: THUMB_WIDTH,
          "&:active": { cursor: "grabbing" },
        }}
      />
    </Box>
  )
}
