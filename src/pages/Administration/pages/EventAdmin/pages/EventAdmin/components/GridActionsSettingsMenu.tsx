import React, { useState } from "react"
import { GridActionsCellItem } from "@mui/x-data-grid"
import SettingsIcon from "@mui/icons-material/Settings"
import Tooltip from "@mui/material/Tooltip"
import { useTranslation } from "react-i18next"
import { Divider, ListItemIcon, ListItemText, Menu } from "@mui/material"
import MenuItem from "@mui/material/MenuItem"
import EditIcon from "@mui/icons-material/Edit"
import GridActionsSettingsMenuDialogItem from "./GridActionsSettingsMenuDialogItem.tsx"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import PersonOffIcon from "@mui/icons-material/PersonOff"

type GridActionsSettingsMenuProps = {
  handleDeleteClick: () => void
  handleEditClick: () => void
  handleWipeOutRunnersClick: () => void
  handleStatsClick: () => void
}

const GridActionsSettingsMenu: React.FC<GridActionsSettingsMenuProps> = ({
  handleDeleteClick,
  handleEditClick,
  handleWipeOutRunnersClick,
}) => {
  const { t } = useTranslation()

  // Menu functions
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Tooltip title={t("Settings")}>
        <GridActionsCellItem
          icon={<SettingsIcon />}
          label={"Settings"}
          className="textPrimary"
          color="inherit"
          onClick={handleClick}
        />
      </Tooltip>
      <Menu id={"options"} anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleEditClick}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText>{t("Edit")}</ListItemText>
        </MenuItem>
        <Divider />
        <GridActionsSettingsMenuDialogItem
          icon={<PersonOffIcon />}
          menuText={t("EventAdmin.Stages.WipeOutRunners.MenuText")}
          action={() => {
            handleClose()
            handleWipeOutRunnersClick()
          }}
          menuCloseAction={handleClose}
          dialogTitle={t("EventAdmin.Stages.WipeOutRunners.DialogTitle")}
          dialogBody={t("EventAdmin.Stages.WipeOutRunners.DialogBody")}
          dialogCancelButtonText={t("Cancel")}
          dialogConfirmButtonText={t("EventAdmin.Stages.WipeOutRunners.DialogConfirm")}
        />
        <GridActionsSettingsMenuDialogItem
          icon={<DeleteIcon />}
          menuText={t("EventAdmin.Stages.DeleteStage.MenuText")}
          action={() => {
            handleDeleteClick()
            handleClose()
          }}
          menuCloseAction={handleClose}
          dialogTitle={t("EventAdmin.Stages.DeleteStage.DialogTitle")}
          dialogBody={t("EventAdmin.Stages.DeleteStage.DialogBody")}
          dialogCancelButtonText={t("Cancel")}
          dialogConfirmButtonText={t("Delete")}
        />
      </Menu>
    </>
  )
}

export default GridActionsSettingsMenu
