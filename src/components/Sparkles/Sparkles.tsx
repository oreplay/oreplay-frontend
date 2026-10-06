import Box from "@mui/material/Box"
import { ReactNode } from "react"
import SparkleStar from "./components/SparkleStar.tsx"
import { ICON_SPARKLES } from "./shared/sparkle.ts"

interface SparklesProps {
  children: ReactNode
}

export default function Sparkles({ children }: SparklesProps) {
  return (
    <Box component="span" sx={{ display: "inline-flex", position: "relative" }}>
      {children}
      <Box
        component="svg"
        aria-hidden
        viewBox="0 0 24 24"
        data-testid="sparkles"
        sx={{
          fill: "currentColor",
          color: "primary.main",
          height: "100%",
          inset: 0,
          overflow: "visible",
          pointerEvents: "none",
          position: "absolute",
          width: "100%",
        }}
      >
        {ICON_SPARKLES.map((sparkle) => (
          <SparkleStar key={sparkle.delaySeconds} sparkle={sparkle} />
        ))}
      </Box>
    </Box>
  )
}
