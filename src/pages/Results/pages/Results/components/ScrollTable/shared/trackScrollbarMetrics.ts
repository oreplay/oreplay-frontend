import { scrollProgress, visibleRatio } from "./scrollbarMetrics.ts"

export const SCROLL_PROGRESS_CSS_VARIABLE = "--scroll-progress"
export const VISIBLE_RATIO_CSS_VARIABLE = "--visible-ratio"

export default function trackScrollbarMetrics(scroller: HTMLElement, scrollbar: HTMLElement) {
  const writeMetrics = () => {
    const { clientWidth, scrollLeft, scrollWidth } = scroller
    scrollbar.style.setProperty(
      SCROLL_PROGRESS_CSS_VARIABLE,
      String(scrollProgress(scrollLeft, scrollWidth, clientWidth)),
    )
    scrollbar.style.setProperty(
      VISIBLE_RATIO_CSS_VARIABLE,
      String(visibleRatio(scrollWidth, clientWidth)),
    )
  }

  const observer = new ResizeObserver(writeMetrics)
  observer.observe(scroller)
  Array.from(scroller.children).forEach((content) => observer.observe(content))
  scroller.addEventListener("scroll", writeMetrics, { passive: true })
  writeMetrics()

  return () => {
    observer.disconnect()
    scroller.removeEventListener("scroll", writeMetrics)
  }
}
