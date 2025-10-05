import Box from "@mui/material/Box"
import AddIcon from "@mui/icons-material/Add"
import SaveIcon from "@mui/icons-material/Save"
import CancelIcon from "@mui/icons-material/Close"
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridEventListener,
  GridRowModel,
  GridRowEditStopReasons,
  GridRowParams,
  GridToolbarProps,
  GridRenderEditCellParams,
} from "@mui/x-data-grid"
import { useTranslation } from "react-i18next"
import React, { useState } from "react"
import {
  deleteStage,
  getEventStats,
  patchStage,
  postStage,
  wipeOutStage,
} from "../../../../../../services/EventAdminService.ts"
import Tooltip from "@mui/material/Tooltip"
import { EventDetailModel } from "../../../../../../../../shared/EntityTypes.ts"
import { useAuth } from "../../../../../../../../shared/hooks.ts"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import GridActionsSettingsMenu from "./components/GridActionsSettingsMenu.tsx"
import { useNotifications } from "@toolpad/core/useNotifications"
import { stageStatsService } from "../../../../../../../../domain/services/StageStatsService.ts"
import { Link } from "react-router-dom"
import { IconButton, MenuItem, Select, Toolbar } from "@mui/material"
import { STAGE_TYPE_DATABASE_ID } from "../../../../../../../Results/pages/Results/shared/constants.ts"
import ConstructionIcon from "@mui/icons-material/Construction"

/**
 * Auxiliary component to introduce buttons on top of the DataGrid
 */
interface EditToolbarProps extends GridToolbarProps {
  setRows: React.Dispatch<React.SetStateAction<GridRowsProp>>
  setRowModesModel: React.Dispatch<React.SetStateAction<GridRowModesModel>>
}
function EditToolbar(props: EditToolbarProps) {
  const { t } = useTranslation()
  const { setRows, setRowModesModel } = props

  const handleClick = () => {
    const id = `new-${Math.random().toString(36).substring(2, 9)}`
    setRows((oldRows) => [...oldRows, { id: id, stageName: "", isNew: true, isEdit: false }])
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }))
  }

  return (
    <Toolbar
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        backgroundColor: "background.paper",
      }}
    >
      <Tooltip title={t("EventAdmin.Stages.NewStage")}>
        <IconButton
          onClick={handleClick}
          sx={{
            borderRadius: Infinity,
          }}
        >
          <AddIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  )
}

/**
 * Props for StagesDataGrid
 */
interface Props {
  eventDetail: EventDetailModel
}

/**
 * Possible properties of a row in the stages DataGrid
 */
export interface StageRow {
  id: string
  stageId: string
  stageName: string
  stageTypeId: string
  isNew?: boolean
  isEdit?: boolean
}

export default function StagesDataGrid(props: Props) {
  const { t } = useTranslation()
  const { token } = useAuth()
  const notifications = useNotifications()

  const stageTypeOptions = [
    {
      value: STAGE_TYPE_DATABASE_ID.FootO,
      label: t("EventAdmin.Stages.StagesTypes.FootO.title"),
      description: t("EventAdmin.Stages.StagesTypes.FootO.description"),
    },
    {
      value: STAGE_TYPE_DATABASE_ID.Rogaine,
      label: t("EventAdmin.Stages.StagesTypes.Rogaine.title"),
      description: t("EventAdmin.Stages.StagesTypes.Rogaine.description"),
    },
    {
      value: STAGE_TYPE_DATABASE_ID.Relay,
      label: t("EventAdmin.Stages.StagesTypes.Relay.title"),
      description: t("EventAdmin.Stages.StagesTypes.Relay.description"),
      icon: (
        <Tooltip title={t("UnderDevelopment")}>
          <ConstructionIcon fontSize="small" />
        </Tooltip>
      ),
    },
    {
      value: STAGE_TYPE_DATABASE_ID.OneManRelay,
      label: t("EventAdmin.Stages.StagesTypes.OneManRelay.title"),
      description: t("EventAdmin.Stages.StagesTypes.OneManRelay.description"),
      icon: (
        <Tooltip title={t("UnderDevelopment")}>
          <ConstructionIcon fontSize="small" />
        </Tooltip>
      ),
    },
    {
      value: STAGE_TYPE_DATABASE_ID.Totals,
      label: t("EventAdmin.Stages.StagesTypes.Totals.title"),
      description: t("EventAdmin.Stages.StagesTypes.Totals.description"),
    },
  ]

  const initialRows: GridRowsProp<StageRow> = props.eventDetail.stages.map((stage) => ({
    id: stage.id,
    stageId: stage.id,
    stageName: stage.description,
    stageTypeId: stage.stage_type.id,
  }))

  const [rows, setRows] = useState(initialRows)
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = (row: GridRowParams<StageRow>) => {
    setRowModesModel({ ...rowModesModel, [row.id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (row: GridRowParams<StageRow>) => () => {
    setRowModesModel({ ...rowModesModel, [row.id]: { mode: GridRowModes.View } })
  }

  const handleDeleteClick = async (row: GridRowParams<StageRow>) => {
    await deleteStage(props.eventDetail.id, row.row.stageId, token as string).then(() =>
      setRows(rows.filter((thisRow) => thisRow.id !== row.id)),
    )
  }

  const handleStatsClick = async (row: GridRowParams<StageRow>) => {
    try {
      const res = await getEventStats(props.eventDetail.id, row.row.stageId)
      const dataProcessed = stageStatsService.processData(res.data)
      const txtTable = stageStatsService.formatAsTxtTables(dataProcessed)
      const htmlTable = stageStatsService.formatAsHtmlTables(dataProcessed)
      await navigator.clipboard.writeText(txtTable)
      notifications.show(
        <span
          dangerouslySetInnerHTML={{ __html: t("Copied to the clipboard") + "</br>" + htmlTable }}
        />,
        {
          autoHideDuration: 15000,
          severity: "success",
        },
      )
    } catch (e) {
      notifications.show("Error", {
        autoHideDuration: 3000,
        severity: "error",
      })
    }
  }

  const handleWipeOutRunnersClick = async (row: GridRowParams<StageRow>) => {
    try {
      const resetNotification = notifications.show(t("Loading"), {
        autoHideDuration: 30000,
        severity: "info", // Could be 'success', 'error', 'warning', 'info'.
      })
      await wipeOutStage(props.eventDetail.id, row.row.stageId, token as string).then(() => {})
      notifications.close(resetNotification)
      notifications.show(t("Success"), {
        autoHideDuration: 3000,
        severity: "success", // Could be 'success', 'error', 'warning', 'info'.
      })
    } catch (e) {
      notifications.show("An error occurred resetting the event.", {
        autoHideDuration: 3000,
        severity: "error", // Could be 'success', 'error', 'warning', 'info'.
      })
    }
  }

  const handleCancelClick = (row: GridRowParams<StageRow>) => () => {
    setRowModesModel({
      ...rowModesModel,
      [row.id]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    const editedRow = rows.find((thisRow) => thisRow.id === row.id)
    if (editedRow!.isNew) {
      setRows(rows.filter((thisRow) => thisRow.id !== row.id))
    }
  }

  const processRowUpdate = async (newRow: GridRowModel<StageRow>) => {
    const updatedRow: GridRowModel<StageRow> = { ...newRow, isEdit: false, isNew: false }
    if (newRow.isNew) {
      // Case row is posted to the server
      try {
        const response = await postStage(
          props.eventDetail.id,
          newRow.stageName,
          newRow.stageTypeId,
          token,
        )
        updatedRow.id = response.data.id
        updatedRow.stageId = response.data.id
      } catch (error) {
        console.error("Something bad happened while posting the stage: ", error)
      }
    } // Case Row is patched to the server
    else {
      try {
        await patchStage(
          props.eventDetail.id,
          newRow.stageId,
          newRow.stageName,
          newRow.stageTypeId,
          token as string,
        )
      } catch (error) {
        console.error("Something bad happened while updating the stage: ", error)
      }
    }

    // Update DataGridView
    console.log(rows)
    setRows(
      rows.map(
        (row): GridRowModel<StageRow> =>
          row.id === newRow.id || row.id == "newlyCreatedStage" ? updatedRow : row,
      ),
    )
    return updatedRow
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const columns: GridColDef[] = [
    {
      field: "stageName",
      headerName: t("Name"),
      flex: 1,
      minWidth: 200,
      type: "string",
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "stageTypeId",
      headerName: t("EventAdmin.Stages.StagesTypes.StageType"),
      width: 200,
      editable: true,
      type: "singleSelect",
      valueOptions: stageTypeOptions.map((opt) => ({ value: opt.value, label: opt.label })),
      renderEditCell: (params: GridRenderEditCellParams<GridRowModel, string>) => {
        const { id, field, value, api } = params
        return (
          <Select
            value={(value as string) ?? ""}
            onChange={(e) => {
              void api.setEditCellValue({ id, field, value: e.target.value })
            }}
            fullWidth
            renderValue={(selected) => {
              const opt = stageTypeOptions.find((o) => o.value === selected)
              if (!opt) return ""
              return (
                <div style={{ display: "flex", alignItems: "center" }}>
                  {opt.icon}
                  <span style={{ marginLeft: 8 }}>{opt.label}</span>
                </div>
              )
            }}
            MenuProps={{
              PaperProps: {
                style: { maxWidth: 300 },
              },
            }}
          >
            {stageTypeOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value} sx={{ maxWidth: 300 }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  {/* First line: icon + title */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {opt.icon}
                    <span
                      style={{
                        marginLeft: 8,
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {opt.label}
                    </span>
                  </div>

                  {/* Second line: description */}
                  <div
                    style={{
                      marginLeft: 8, // aligns under text (not icon)
                      fontSize: "0.8rem",
                      color: "gray",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    {opt.description}
                  </div>
                </div>
              </MenuItem>
            ))}
          </Select>
        )
      },
      renderCell: (params) => {
        const opt = stageTypeOptions.find((o) => o.value === params.value)
        if (!opt) return null
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            {opt.icon}
            <span style={{ marginLeft: 6 }}>{opt.label}</span>
          </div>
        )
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "",
      width: 100,
      cellClassName: "actions",
      getActions: (row: GridRowParams<StageRow>) => {
        const isInEditMode = rowModesModel[row.id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <Tooltip title={t("Save")}>
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                sx={{
                  color: "primary.main",
                }}
                onClick={handleSaveClick(row)}
              />
            </Tooltip>,
            <Tooltip title={t("Cancel")}>
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(row)}
                color="inherit"
              />
            </Tooltip>,
          ]
        }

        return [
          <GridActionsSettingsMenu
            handleEditClick={() => handleEditClick(row)}
            handleDeleteClick={() => void handleDeleteClick(row)}
            handleStatsClick={() => void handleStatsClick(row)}
            handleWipeOutRunnersClick={() => void handleWipeOutRunnersClick(row)}
          />,
          <Tooltip title={t("EventAdmin.Stages.GoToStage")}>
            <Link
              className="textPrimary"
              to={`/competitions/${props.eventDetail.id}/${row.row.stageId}`}
              style={{ display: "flex", alignItems: "center" }}
            >
              <ArrowForwardIcon />
            </Link>
          </Tooltip>,
        ]
      },
    },
  ]

  return (
    <Box
      sx={{
        minHeight: 200,
        maxHeight: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          // @ts-expect-error TS2322 This is a custom component with extra props
          toolbar: EditToolbar,
        }}
        slotProps={{
          // @ts-expect-error TS2353 the custom component contains extra props
          toolbar: { setRows, setRowModesModel },
        }}
        sx={{
          backgroundColor: "white",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",

          // Remove square corners from internal container
          "& .MuiDataGrid-main": {
            borderRadius: 3,
          },

          // Remove default border and create padding
          "&.MuiDataGrid-root": {
            border: "none",
            paddingX: 4,
            paddingY: 2,
          },
        }}
      />
    </Box>
  )
}
