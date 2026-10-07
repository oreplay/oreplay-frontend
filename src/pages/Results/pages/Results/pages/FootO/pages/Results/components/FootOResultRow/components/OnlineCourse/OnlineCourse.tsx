import "../../../../../../../../../../../../styles/tokens.css"
import { CSSProperties } from "react"
import { useTranslation } from "react-i18next"
import useJoinHorizontalScrollGroup from "../../../../../../shared/horizontalScroll/useJoinHorizontalScrollGroup.ts"
import { OnlineCourse as OnlineCourseModel } from "../../../../shared/onlineCourse/onlineCourse.ts"
import onlineCourseGeometry from "../../../../shared/onlineCourse/onlineCourseGeometry.ts"
import {
  countControls,
  countReachedControls,
} from "../../../../shared/onlineCourse/onlineCourseProgress.ts"
import OnlineCourseLeg from "./components/OnlineCourseLeg.tsx"
import OnlineCourseNode from "./components/OnlineCourseNode.tsx"

const FADING_EDGE_WIDTH_PX = 24
const FADING_EDGE_STYLE = { "--fade-width": `${FADING_EDGE_WIDTH_PX}px` } as CSSProperties

const SCROLLER_CLASS_NAME = [
  "overflow-x-auto",
  "overflow-y-hidden",
  "[scrollbar-width:none]",
  "[&::-webkit-scrollbar]:hidden",
  "[--fade-start:0px]",
  "[--fade-end:0px]",
  "data-[overflows-start=true]:[--fade-start:var(--fade-width)]",
  "data-[overflows-end=true]:[--fade-end:var(--fade-width)]",
  "[mask-image:linear-gradient(to_right,transparent,black_var(--fade-start),black_calc(100%_-_var(--fade-end)),transparent)]",
].join(" ")

interface OnlineCourseProps {
  course: OnlineCourseModel
  className?: string
}

export default function OnlineCourse({ course, className }: OnlineCourseProps) {
  const { t } = useTranslation()
  const joinScrollGroup = useJoinHorizontalScrollGroup<HTMLDivElement>()
  const geometry = onlineCourseGeometry(course.nodes.length)
  const scrollerClassName = [SCROLLER_CLASS_NAME, className].filter(Boolean).join(" ")
  const controlsReachedLabel = t("ResultsStage.OnlineCourse.ControlsReached", {
    reached: countReachedControls(course),
    total: countControls(course),
  })

  return (
    <div className={scrollerClassName} ref={joinScrollGroup} style={FADING_EDGE_STYLE}>
      <svg
        aria-label={controlsReachedLabel}
        className="block font-sans"
        height={geometry.height}
        role="img"
        style={{ minWidth: geometry.minWidth }}
        width="100%"
      >
        {course.legs.map((leg, legIndex) => (
          <OnlineCourseLeg
            geometry={geometry.legs[legIndex]}
            key={legIndex}
            progress={leg.progress}
          />
        ))}
        {course.nodes.map((node, nodeIndex) => (
          <OnlineCourseNode geometry={geometry.nodes[nodeIndex]} key={nodeIndex} node={node} />
        ))}
      </svg>
    </div>
  )
}
