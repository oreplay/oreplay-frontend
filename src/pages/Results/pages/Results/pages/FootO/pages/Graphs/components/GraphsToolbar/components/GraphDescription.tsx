import { KeyboardEvent, PointerEvent, useId, useState } from "react"
import {
  CLOSE_KEY,
  isDescriptionVisible,
  isMousePointer,
} from "../../../shared/descriptionVisibility.ts"
import InfoIcon from "./icons/InfoIcon.tsx"

interface GraphDescriptionProps {
  description: string
  label: string
}

/**
 * Info icon that explains the graph on screen. Hovering it with a mouse shows the explanation, and
 * a click or a tap pins it open until it is clicked again, loses the focus or Escape is pressed.
 * The explanation is anchored to the closest positioned ancestor.
 *
 * @param props.description Already translated explanation of the graph.
 * @param props.label Already translated name of the icon for assistive technology.
 */
export default function GraphDescription({ description, label }: GraphDescriptionProps) {
  const descriptionId = useId()
  const [isHovered, setIsHovered] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const isVisible = isDescriptionVisible(isHovered, isPinned)
  const colorClass = isVisible ? "text-primary" : "text-neutral-500 hover:text-neutral-800"

  const hoverWithMouse = (event: PointerEvent) => {
    if (isMousePointer(event.pointerType)) setIsHovered(true)
  }

  const closeFromKeyboard = (event: KeyboardEvent) => {
    if (event.key !== CLOSE_KEY) return
    setIsHovered(false)
    setIsPinned(false)
  }

  return (
    <div
      className="graph-description flex"
      onPointerEnter={hoverWithMouse}
      onPointerLeave={() => setIsHovered(false)}
    >
      <button
        type="button"
        aria-label={label}
        aria-expanded={isVisible}
        aria-describedby={descriptionId}
        onClick={() => setIsPinned((wasPinned) => !wasPinned)}
        onBlur={() => setIsPinned(false)}
        onKeyDown={closeFromKeyboard}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${colorClass}`}
      >
        <InfoIcon />
      </button>
      <p
        role="tooltip"
        id={descriptionId}
        hidden={!isVisible}
        className="absolute left-0 top-full z-10 m-0 w-80 max-w-full rounded-lg border border-solid border-neutral-200 bg-white p-3 text-left text-sm font-normal leading-relaxed text-neutral-700 shadow-[0_4px_16px_rgba(0,0,0,0.12)] sm:left-auto sm:right-0 sm:max-w-none"
      >
        {description}
      </p>
    </div>
  )
}
