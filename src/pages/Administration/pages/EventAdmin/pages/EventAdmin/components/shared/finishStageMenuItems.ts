import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined"
import OfficialOffIcon from "../OfficialOffIcon.tsx"

export const FINISH_STAGE_ITEM = {
  Icon: VerifiedOutlinedIcon,
  menuTextKey: "EventAdmin.Stages.FinishStage.MenuText",
  dialogTitleKey: "EventAdmin.Stages.FinishStage.DialogTitle",
  dialogBodyKey: "EventAdmin.Stages.FinishStage.DialogBody",
  dialogConfirmKey: "EventAdmin.Stages.FinishStage.DialogConfirm",
  shouldBeEnded: true,
}

export const REOPEN_STAGE_ITEM = {
  Icon: OfficialOffIcon,
  menuTextKey: "EventAdmin.Stages.FinishStage.Undo.MenuText",
  dialogTitleKey: "EventAdmin.Stages.FinishStage.Undo.DialogTitle",
  dialogBodyKey: "EventAdmin.Stages.FinishStage.Undo.DialogBody",
  dialogConfirmKey: "EventAdmin.Stages.FinishStage.Undo.DialogConfirm",
  shouldBeEnded: false,
}

/**
 * Picks the settings menu entry that toggles a stage's official state: making it official when it
 * is provisional, or provisional again when it is official.
 * @param isStageEnded Whether the stage's results are official.
 * @returns The entry's icon, translation keys and the state it sets.
 */
export function getFinishStageItem(isStageEnded: boolean) {
  return isStageEnded ? REOPEN_STAGE_ITEM : FINISH_STAGE_ITEM
}
