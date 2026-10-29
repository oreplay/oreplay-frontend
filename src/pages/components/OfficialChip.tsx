import { alpha, Chip, Tooltip } from "@mui/material"
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined"
import { useTranslation } from "react-i18next"
import {
  getOfficialChipDimensions,
  OFFICIAL_CHIP_SIZE,
  OfficialChipSize,
} from "../shared/officialChipSizes.ts"

const BACKGROUND_OPACITY = 0.1

interface OfficialChipProps {
  tooltip: string
  size?: OfficialChipSize
}

/**
 * Orange "Official" chip with a verified-seal icon, telling that a stage's results are officially
 * confirmed. Callers render it only when that is the case; there is no "unofficial" variant. The icon
 * is decorative because the label already says it all. Hovering, focusing or tapping it shows a
 * tooltip explaining what "official" means for whoever is looking.
 * @param props.tooltip Explanation shown on hover, focus or tap; it describes the chip without
 * replacing its label for screen readers.
 * @param props.size Compact for table rows and lists, regular (the default) everywhere else.
 */
export default function OfficialChip({
  tooltip,
  size = OFFICIAL_CHIP_SIZE.Regular,
}: OfficialChipProps) {
  const { t } = useTranslation()
  const dimensions = getOfficialChipDimensions(size)

  return (
    <Tooltip title={tooltip} describeChild enterTouchDelay={0}>
      <Chip
        tabIndex={0}
        icon={<VerifiedOutlinedIcon aria-hidden />}
        label={t("common:official")}
        sx={{
          height: dimensions.heightPx,
          borderRadius: `${dimensions.heightPx / 2}px`,
          gap: `${dimensions.gapPx}px`,
          paddingLeft: `${dimensions.paddingLeftPx}px`,
          paddingRight: `${dimensions.paddingRightPx}px`,
          fontSize: dimensions.labelPx,
          fontWeight: 500,
          border: (theme) => `0.5px solid ${theme.palette.primary.main}`,
          backgroundColor: (theme) => alpha(theme.palette.primary.main, BACKGROUND_OPACITY),
          color: "primary.dark",
          "& .MuiChip-icon": { margin: 0, fontSize: dimensions.iconPx, color: "inherit" },
          "& .MuiChip-label": { padding: 0 },
        }}
      />
    </Tooltip>
  )
}
