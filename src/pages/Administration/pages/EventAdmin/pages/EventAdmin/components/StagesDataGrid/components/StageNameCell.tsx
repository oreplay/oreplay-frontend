import { Box } from "@mui/material"
import { useTranslation } from "react-i18next"
import OfficialChip from "../../../../../../../../components/OfficialChip.tsx"
import { OFFICIAL_CHIP_SIZE } from "../../../../../../../../shared/officialChipSizes.ts"

const NAME_TO_CHIP_GAP_PX = 12

interface StageNameCellProps {
  name: string
  isEnded: boolean
}

/**
 * Stage name cell of the admin stages table, followed by a compact "Official" chip once the stage
 * has been finished. Hovering the chip reminds the organizer how to make the results provisional.
 * @param props.name Stage name; long names are cut with an ellipsis so the chip stays visible.
 * @param props.isEnded Whether the organizer marked the stage as finished, making its results official.
 */
export default function StageNameCell({ name, isEnded }: StageNameCellProps) {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: `${NAME_TO_CHIP_GAP_PX}px`,
        height: "100%",
        minWidth: 0,
      }}
    >
      <Box component="span" sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
        {name}
      </Box>
      {isEnded && (
        <OfficialChip
          tooltip={t("EventAdmin.Stages.FinishStage.Tooltip")}
          size={OFFICIAL_CHIP_SIZE.Compact}
        />
      )}
    </Box>
  )
}
