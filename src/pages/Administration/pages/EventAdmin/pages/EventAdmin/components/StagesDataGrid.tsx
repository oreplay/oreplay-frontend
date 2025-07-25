import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
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
} from "@mui/x-data-grid"
import { useTranslation } from "react-i18next"
import React, { useState } from "react"
import {
  deleteStage,
  getEventStats,
  patchStage,
  postStage,
  wipeOutStage,
} from "../../../../../services/EventAdminService.ts"
import Tooltip from "@mui/material/Tooltip"
import { EventDetailModel } from "../../../../../../../shared/EntityTypes.ts"
import { useAuth } from "../../../../../../../shared/hooks.ts"
import { stageTypes } from "../../../../../../../shared/Constants.ts"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import GridActionsSettingsMenu from "./GridActionsSettingsMenu.tsx"
import { useNotifications } from "@toolpad/core/useNotifications"
import { stageStatsService } from "../../../../../../../domain/services/StageStatsService.ts"
import { useNavigate } from "react-router-dom"
import { Toolbar } from "@mui/material"

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
    <Toolbar>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        {t("EventAdmin.Stages.NewStage")}
      </Button>
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
  const navigate = useNavigate()

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
      type: "string",
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "stageTypeId",
      headerName: t("EventAdmin.Stages.StagesTypes.StageType"),
      width: 150,
      type: "singleSelect",
      valueOptions: stageTypes.map((item: { value: string; label: string }) => {
        const label: string = t(`EventAdmin.Stages.StagesTypes.${item.label}`)
        return { value: item.value, label: label }
      }), //Object.keys(stageTypesId),
      align: "left",
      headerAlign: "left",
      editable: true,
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
            <GridActionsCellItem
              icon={<ArrowForwardIcon />}
              label="View"
              className="textPrimary"
              color="inherit"
              onClick={() => {
                void navigate(`/competitions/${props.eventDetail.id}/${row.row.stageId}`)
              }}
            />
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
      />
    </Box>
  )
}
