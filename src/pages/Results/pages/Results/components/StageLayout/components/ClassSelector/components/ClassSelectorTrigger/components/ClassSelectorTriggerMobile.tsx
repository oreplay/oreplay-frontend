import { Box, Fab } from "@mui/material"
import ListIcon from "@mui/icons-material/List"
import { useTranslation } from "react-i18next"
import {
  MOBILE_FLOATING_BUTTON_BOTTOM_OFFSET_PX,
  MOBILE_FLOATING_BUTTON_GAP_PX,
  MOBILE_FLOATING_BUTTON_HEIGHT_PX,
} from "../../../../../../../shared/mobileLayout.ts"
import {
  classSelectorLabelKey,
  ClassSelectorTriggerProps,
  classSelectorTriggerText,
} from "../../../shared/classSelector.ts"

export default function ClassSelectorTriggerMobile(props: ClassSelectorTriggerProps) {
  const { t } = useTranslation()
  const text = classSelectorTriggerText(props.activeName, t(classSelectorLabelKey(props.isClass)))

  return (
    <Fab
      variant="extended"
      color="primary"
      aria-haspopup="dialog"
      onClick={props.onClick}
      sx={{
        position: "fixed",
        bottom: `${MOBILE_FLOATING_BUTTON_BOTTOM_OFFSET_PX}px`,
        right: `${MOBILE_FLOATING_BUTTON_GAP_PX}px`,
        height: `${MOBILE_FLOATING_BUTTON_HEIGHT_PX}px`,
        maxWidth: `calc(100vw - ${2 * MOBILE_FLOATING_BUTTON_GAP_PX}px)`,
        textTransform: "none",
      }}
    >
      <ListIcon sx={{ marginRight: 1 }} />
      <Box
        component="span"
        sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
      >
        {text}
      </Box>
    </Fab>
  )
}
