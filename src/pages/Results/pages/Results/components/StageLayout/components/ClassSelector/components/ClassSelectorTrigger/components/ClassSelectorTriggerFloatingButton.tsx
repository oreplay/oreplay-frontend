import { Box, Button } from "@mui/material"
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

export default function ClassSelectorTriggerFloatingButton(props: ClassSelectorTriggerProps) {
  const { t } = useTranslation()
  const text = classSelectorTriggerText(props.activeName, t(classSelectorLabelKey(props.isClass)))

  return (
    <Button
      variant="outlined"
      color="primary"
      aria-haspopup="dialog"
      onClick={props.onClick}
      sx={{
        position: "fixed",
        zIndex: "fab",
        boxShadow: 3,
        borderRadius: 3,
        backgroundColor: "background.paper",
        "&:hover": { backgroundColor: "background.paper" },
        bottom: `${MOBILE_FLOATING_BUTTON_BOTTOM_OFFSET_PX}px`,
        right: `${MOBILE_FLOATING_BUTTON_GAP_PX}px`,
        height: `${MOBILE_FLOATING_BUTTON_HEIGHT_PX}px`,
        maxWidth: `calc(100vw - ${2 * MOBILE_FLOATING_BUTTON_GAP_PX}px)`,
        textTransform: "none",
      }}
    >
      <Box
        component="span"
        sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
      >
        {text}
      </Box>
    </Button>
  )
}
