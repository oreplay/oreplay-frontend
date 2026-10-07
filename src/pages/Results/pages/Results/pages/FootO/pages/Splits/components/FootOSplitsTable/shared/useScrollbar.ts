import { MouseEvent, PointerEvent, RefObject, useEffect, useRef } from "react"
import { scrollLeftAfterThumbDrag, scrollLeftForTrackClick } from "./scrollbarMetrics.ts"
import trackScrollbarMetrics from "./trackScrollbarMetrics.ts"

interface ThumbDragOrigin {
  pointerX: number
  scrollLeft: number
}

export default function useScrollbar(scrollerRef: RefObject<HTMLElement | null>) {
  const scrollbarRef = useRef<HTMLDivElement | null>(null)
  const thumbRef = useRef<HTMLDivElement | null>(null)
  const thumbDragOrigin = useRef<ThumbDragOrigin | null>(null)

  useEffect(() => {
    if (!scrollerRef.current || !scrollbarRef.current) return
    return trackScrollbarMetrics(scrollerRef.current, scrollbarRef.current)
  }, [scrollerRef])

  const startThumbDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!scrollerRef.current) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    thumbDragOrigin.current = {
      pointerX: event.clientX,
      scrollLeft: scrollerRef.current.scrollLeft,
    }
  }

  const dragThumb = (event: PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current
    const scrollbar = scrollbarRef.current
    const origin = thumbDragOrigin.current
    if (!scroller || !scrollbar || !origin) return
    scroller.scrollLeft = scrollLeftAfterThumbDrag({
      maxScrollLeft: scroller.scrollWidth - scroller.clientWidth,
      pointerDelta: event.clientX - origin.pointerX,
      startScrollLeft: origin.scrollLeft,
      thumbTravel: scrollbar.clientWidth - event.currentTarget.offsetWidth,
    })
  }

  const endThumbDrag = () => {
    thumbDragOrigin.current = null
  }

  const scrollToTrackClick = (event: MouseEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current
    const thumb = thumbRef.current
    if (!scroller || !thumb) return
    const track = event.currentTarget
    scroller.scrollTo({
      behavior: "smooth",
      left: scrollLeftForTrackClick({
        clickOffset: event.clientX - track.getBoundingClientRect().left,
        scrollWidth: scroller.scrollWidth,
        thumbWidth: thumb.offsetWidth,
        trackWidth: track.clientWidth,
      }),
    })
  }

  return { dragThumb, endThumbDrag, scrollbarRef, scrollToTrackClick, startThumbDrag, thumbRef }
}
