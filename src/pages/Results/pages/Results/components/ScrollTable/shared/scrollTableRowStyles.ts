import { HEADING_COLUMN_CELL_SX } from "./scrollTableLayout.ts"

const CELL_BACKGROUND_COLOR = "#F6F6F6"
const TOP_SHADE = "linear-gradient(180deg, #00000008 0%, #F6F6F6FF 10%)"
const LEFT_SHADE = "linear-gradient(90deg, #00000008 0%, #F6F6F6FF 10%)"
const HEADING_COLUMN_MAX_WIDTH = "16rem"
const HEADING_COLUMN_MIN_WIDTH = "12rem"

export const CELL_SX = {
  py: "12px",
  px: "8px",
  background: TOP_SHADE,
  backgroundColor: CELL_BACKGROUND_COLOR,
  border: "none",
  "&:first-of-type": {
    px: "16px",
    background: `${TOP_SHADE}, ${LEFT_SHADE}`,
    backgroundBlendMode: "darken",
    backgroundColor: CELL_BACKGROUND_COLOR,
    borderRadius: "6px 0 0 6px",
  },
  "&:last-of-type": { borderRadius: "0 6px 6px 0" },
  "&:first-of-type:last-of-type": { borderRadius: "6px" },
}

export const HEADING_COLUMN_BODY_CELL_SX = {
  ...CELL_SX,
  ...HEADING_COLUMN_CELL_SX,
  fontWeight: "bold",
}

export const HEADING_COLUMN_CONTENT_SX = {
  display: "flex",
  minWidth: HEADING_COLUMN_MIN_WIDTH,
  maxWidth: HEADING_COLUMN_MAX_WIDTH,
}

export const HEADING_ROW_CELL_SX = {
  border: "none",
  backgroundColor: "white",
  fontWeight: "bold",
  padding: "16px 16px calc(16px + 2rem) 16px",
}

export const HEADING_ROW_CONTENT_SX = {
  display: "inline-flex",
  position: "absolute",
  pointerEvents: "none",
}
