import { Box, Skeleton, Stack } from "@mui/material"

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
  return (
    <Stack style={{ height: "100%", overflow: "hidden" }} direction={"column"} gap={0}>
      {Array.from({ length: 10 }).map((_, index) => (
        <ResultListItemSkeleton key={index} />
      ))}
    </Stack>
  )
}
