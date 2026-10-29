import { Components, Theme } from "@mui/material"
import {
  offsetFromSafeArea,
  SAFE_AREA_INSET_BOTTOM,
  SAFE_AREA_INSET_LEFT,
  SAFE_AREA_INSET_RIGHT,
  SAFE_AREA_INSET_TOP,
} from "./safeArea.ts"

const SNACKBAR_TOP_OFFSET_PX = { xs: 8, sm: 24 }

/**
 * Places a top-anchored snackbar at MUI's usual distance from the top, measured from below the
 * hidden top area instead of from the screen edge.
 *
 * @param props.theme Theme whose breakpoints pick the small- or large-screen distance.
 * @returns The snackbar's `top` style for every breakpoint.
 */
function snackbarTopAnchorStyle({ theme }: { theme: Theme }) {
  return {
    top: offsetFromSafeArea(SAFE_AREA_INSET_TOP, SNACKBAR_TOP_OFFSET_PX.xs),
    [theme.breakpoints.up("sm")]: {
      top: offsetFromSafeArea(SAFE_AREA_INSET_TOP, SNACKBAR_TOP_OFFSET_PX.sm),
    },
  }
}

/**
 * MUI component overrides that keep overlays clear of the screen areas a device hides behind its
 * hardware (notch, Dynamic Island, home indicator). Dialogs and snackbars render outside the app
 * layout, so they cannot inherit its safe-area padding and need it here instead.
 *
 * Dialogs pad their full-screen container by the hidden areas, which shrinks the space every dialog
 * paper sizes and centres itself in. Top-anchored snackbars keep their usual distance below the
 * hidden top area.
 */
export const SAFE_AREA_THEME_COMPONENTS: Components<Theme> = {
  MuiDialog: {
    styleOverrides: {
      container: {
        boxSizing: "border-box",
        paddingTop: SAFE_AREA_INSET_TOP,
        paddingRight: SAFE_AREA_INSET_RIGHT,
        paddingBottom: SAFE_AREA_INSET_BOTTOM,
        paddingLeft: SAFE_AREA_INSET_LEFT,
      },
    },
  },
  MuiSnackbar: {
    styleOverrides: {
      anchorOriginTopCenter: snackbarTopAnchorStyle,
      anchorOriginTopLeft: snackbarTopAnchorStyle,
      anchorOriginTopRight: snackbarTopAnchorStyle,
    },
  },
}
