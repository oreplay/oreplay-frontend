import { Box, Skeleton, Stack } from "@mui/material"
import { useEffect, useRef, useState } from "react"

function ResultListItemSkeleton() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContents: "space-between",
        maxWidth: 600,
        width: "100%",
        gap: "5px",
        borderBottom: "1px solid #f2f2f2",
        paddingY: ".8em",
      }}
    >
      <Skeleton
        sx={{ bgcolor: "gray.10" }}
        variant="rounded"
        height={24}
        width={"100%"}
        animation={"wave"}
      />
      <Skeleton
        sx={{ bgcolor: "gray.10" }}
        variant="rounded"
        height={20}
        width={"100%"}
        animation={"wave"}
      />
    </Box>
  )
}

export default function ResultsListSkeleton() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [skeletonCount, setSkeletonCount] = useState(0)

  useEffect(() => {
    const updateSkeletonCount = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight
        const skeletonHeight = 75 // Set the height of each skeleton (e.g., 40px)
        const count = Math.floor(containerHeight / skeletonHeight)
        setSkeletonCount(count)
      }
    }

    // Initial calculation
    updateSkeletonCount()

    // Recalculate on window resize
    window.addEventListener("resize", updateSkeletonCount)
    return () => {
      window.removeEventListener("resize", updateSkeletonCount)
    }
  }, [])

  return (
    <Stack
      ref={containerRef}
      style={{ height: "100%", overflow: "hidden" }}
      direction={"column"}
      gap={0}
    >
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <ResultListItemSkeleton key={index} />
      ))}
    </Stack>
  )
}
