import { keyframes, styled } from "@mui/material/styles"
import {
  Sparkle,
  SPARKLE_PERIOD_SECONDS,
  sparklePathOf,
  sparkleTranslationOf,
} from "../shared/sparkle.ts"

const twinkle = keyframes({
  "0%, 100%": { opacity: 0, transform: "scale(0) rotate(0deg)" },
  "50%": { opacity: 1, transform: "scale(1) rotate(90deg)" },
})

const TwinklingPath = styled("path")({
  animation: `${twinkle} ${SPARKLE_PERIOD_SECONDS}s ease-in-out infinite`,
  transformBox: "fill-box",
  transformOrigin: "center",
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
})

interface SparkleStarProps {
  sparkle: Sparkle
}

export default function SparkleStar({ sparkle }: SparkleStarProps) {
  return (
    <g transform={sparkleTranslationOf(sparkle)}>
      <TwinklingPath
        d={sparklePathOf(sparkle.radius)}
        style={{ animationDelay: `${sparkle.delaySeconds}s` }}
      />
    </g>
  )
}
