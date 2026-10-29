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
