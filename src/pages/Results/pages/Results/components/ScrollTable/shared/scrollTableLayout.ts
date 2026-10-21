export const GUTTER_COLUMN_COUNT = 2

const GUTTER_WIDTH = "16px"
const GUTTER_SX = { content: '""', display: "block", width: GUTTER_WIDTH }
const GUTTER_COVER_SX = {
  content: '""',
  position: "absolute",
  top: 0,
  bottom: 0,
  right: "100%",
  width: GUTTER_WIDTH,
  backgroundColor: "white",
}

export const HEADING_COLUMN_BREAKPOINT = "sm"

const HEADING_COLUMN_DIVIDER = "inset -1px 0 0 #E0E0E0"

export const HEADING_COLUMN_CELL_SX = {
  position: "sticky",
  left: GUTTER_WIDTH,
  boxShadow: HEADING_COLUMN_DIVIDER,
  "&:before": GUTTER_COVER_SX,
}

export const HEADING_COLUMN_TABLE_SX = { borderCollapse: "separate", borderSpacing: "0 8px" }

export const ROW_WITH_GUTTERS_SX = { "&:before": GUTTER_SX, "&:after": GUTTER_SX }
