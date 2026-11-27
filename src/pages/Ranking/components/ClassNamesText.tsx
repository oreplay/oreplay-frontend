import { Fragment } from "react"
import { isKnownClassNamePattern, parseClassNames } from "../shared/classNames.ts"

interface ClassNamesTextProps {
  value: string
  /** Why the highlighted names stand out, as the title of each one. */
  unknownPatternLabel: string
  className?: string
}

const UNKNOWN_PATTERN_CLASS = "font-medium text-amber-600"

export default function ClassNamesText({
  value,
  unknownPatternLabel,
  className,
}: ClassNamesTextProps) {
  const classNames = parseClassNames(value)

  return (
    <p className={["rk-class-names-text m-0 text-sm", className].filter(Boolean).join(" ")}>
      {classNames.map((name, index) => {
        const isUnknownPattern = !isKnownClassNamePattern(name)
        return (
          <Fragment key={`${index}-${name}`}>
            {index > 0 && ", "}
            <span
              title={isUnknownPattern ? unknownPatternLabel : undefined}
              className={isUnknownPattern ? UNKNOWN_PATTERN_CLASS : undefined}
            >
              {name}
            </span>
          </Fragment>
        )
      })}
    </p>
  )
}
