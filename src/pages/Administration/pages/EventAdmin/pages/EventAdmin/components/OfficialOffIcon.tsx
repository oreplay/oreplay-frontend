import { Box } from "@mui/material"
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined"

const ICON_SIZE = "1.5rem"
const SLASH_THICKNESS_EM = 0.085
const SLASH_LENGTH_EM = 1.2
const SLASH_GAP_HALF_WIDTH_EM = 0.11
const SLASH_GAP_MASK = `linear-gradient(45deg, #000 calc(50% - ${SLASH_GAP_HALF_WIDTH_EM}em), transparent calc(50% - ${SLASH_GAP_HALF_WIDTH_EM}em) calc(50% + ${SLASH_GAP_HALF_WIDTH_EM}em), #000 calc(50% + ${SLASH_GAP_HALF_WIDTH_EM}em))`

/**
 * The "Official" seal icon crossed out with a diagonal slash, in the style of Material's "off"
 * icons, for taking a stage's official status away. MUI has no such icon, so it is built from the
 * library's seal: a mask cuts a gap along the diagonal and a slash is drawn through it. Decorative,
 * as it always sits next to a text label; it takes its colour from the surrounding text.
 */
export default function OfficialOffIcon() {
  return (
    <Box
      component="span"
      aria-hidden
      sx={{ position: "relative", display: "inline-flex", fontSize: ICON_SIZE }}
    >
      <VerifiedOutlinedIcon
        fontSize="inherit"
        sx={{ maskImage: SLASH_GAP_MASK, WebkitMaskImage: SLASH_GAP_MASK }}
      />
      <Box
        component="span"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: `${SLASH_LENGTH_EM}em`,
          height: `${SLASH_THICKNESS_EM}em`,
          borderRadius: `${SLASH_THICKNESS_EM}em`,
          backgroundColor: "currentColor",
          transform: "translate(-50%, -50%) rotate(45deg)",
        }}
      />
    </Box>
  )
}
