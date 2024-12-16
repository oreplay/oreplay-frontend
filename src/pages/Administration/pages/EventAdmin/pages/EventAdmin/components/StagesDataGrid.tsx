import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowModel,
  GridRowEditStopReasons,
  GridSlots, GridRowParams,
} from '@mui/x-data-grid';
import {useTranslation} from "react-i18next";
import {useState} from "react";
import {deleteStage, patchStage, postStage, wipeOutStage} from "../../../../../services/EventAdminService.ts";
import Tooltip from "@mui/material/Tooltip";
import {EventDetailModel} from "../../../../../../../shared/EntityTypes.ts";
import {useAuth} from "../../../../../../../shared/hooks.ts";
import {stageTypes} from "../../../../../../../shared/Constants.ts";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GridActionsSettingsMenu from "./GridActionsSettingsMenu.tsx";

/**
 * Auxiliary component to introduce buttons on top of the DataGrid
 */
interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const {t} = useTranslation()
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = "newlyCreatedStage"
    setRows((oldRows) => [...oldRows, { id:id, stageName: '', isNew: true, isEdit:false}]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        {t('EventAdmin.Stages.NewStage')}
      </Button>
    </GridToolbarContainer>
  );
}

/**
 * Props for StagesDataGrid
 */
interface Props {
  eventDetail: EventDetailModel;
}

/**
 * Possible properties of a row in the stages DataGrid
 */
export interface StageRow {
  id:string
  stageId:string
  stageName:string,
  stageTypeId:string,
  isNew?:boolean,
  isEdit?:boolean
}

export default function StagesDataGrid(props:Props) {
  const {t} = useTranslation()
  const {token} = useAuth()

  const initialRows : GridRowsProp<StageRow> = props.eventDetail.stages.map(
    (stage)=>(
      {id:stage.id,stageId:stage.id, stageName:stage.description, stageTypeId:stage.stage_type.id }
    )
  )


  const [rows, setRows] = useState(initialRows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (row:GridRowParams<StageRow>) => {
    setRowModesModel({ ...rowModesModel, [row.id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (row:GridRowParams<StageRow>) => () => {
    setRowModesModel({ ...rowModesModel, [row.id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (row:GridRowParams<StageRow>) => {
    deleteStage(
      props.eventDetail.id,
      row.row.stageId,
      token as string
    ).then(()=>
      setRows(rows.filter((thisRow) => thisRow.id !== row.id))
    )
  };

  const handleWipeOutRunnersClick = (row:GridRowParams<StageRow>)=> {
    wipeOutStage(
      props.eventDetail.id,
      row.row.stageId,
      token as string
    ).then(()=>{})
  }

  const handleCancelClick = (row:GridRowParams<StageRow>) => () => {
    setRowModesModel({
      ...rowModesModel,
      [row.id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((thisRow) => thisRow.id === row.id);
    if (editedRow!.isNew) {
      setRows(rows.filter((thisRow) => thisRow.id !== row.id));
    }
  };

  const processRowUpdate = async (newRow: GridRowModel<StageRow>) => {
    const updatedRow:GridRowModel<StageRow> = { ...newRow, isEdit: false, isNew: false };
    if (newRow.isNew) // Case row is posted to the server
    {
      try {
        const response = await postStage(
          props.eventDetail.id,
          newRow.stageName,
          newRow.stageTypeId,
          token
        )
        updatedRow.id = response.data.id
        updatedRow.stageId = response.data.id
      } catch (error) {
        console.error("Something bad happened while posting the stage: ",error)
      }

    } else // Case Row is patched to the server
    {
      try {
        await patchStage(
          props.eventDetail.id,
          newRow.stageId,
          newRow.stageName,
          newRow.stageTypeId,
          token as string)
      } catch (error) {
        console.error("Something bad happened while updating the stage: ",error)
      }
    }

    // Update DataGridView
    console.log(rows)
    setRows(rows.map((row):GridRowModel<StageRow> => (row.id === newRow.id || row.id == "newlyCreatedStage" ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    {
      field:'stageName',
      headerName:t('Name'),
      flex:1,
      type: 'string',
      align: 'left',
      headerAlign : 'left',
      editable:true
    },
    {
      field:'stageTypeId',
      headerName:t('EventAdmin.Stages.StagesTypes.StageType'),
      width:150,
      type: 'singleSelect',
      valueOptions: stageTypes.map( (item:{value:string,label:string})=> {return {value:item.value,label:t(`EventAdmin.Stages.StagesTypes.${item.label}`)} }  ),//Object.keys(stageTypesId),
      align: 'left',
      headerAlign : 'left',
      editable:true
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 100,
      cellClassName: 'actions',
      getActions: (row:GridRowParams<StageRow>) => {
        const isInEditMode = rowModesModel[row.id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <Tooltip title={t('Save')}>
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                sx={{
                  color: 'primary.main',
                }}
                onClick={handleSaveClick(row)}
              />
            </Tooltip>,
            <Tooltip title={t('Cancel')}>
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(row)}
                color="inherit"
              />
            </Tooltip>
          ];
        }

        return [
          <GridActionsSettingsMenu
            handleEditClick={()=>handleEditClick(row)}
            handleDeleteClick={()=>handleDeleteClick(row)}
            handleWipeOutRunnersClick={()=>handleWipeOutRunnersClick(row)}
          />,
          <Tooltip title={t('EventAdmin.Stages.GoToStage')}>
            <GridActionsCellItem
              icon={<ArrowForwardIcon />}
              label="View"
              className="textPrimary"
              color="inherit"
              onClick={
                ()=>{
                  window.open(`/competitions/${props.eventDetail.id}/${row.row.stageId}`,"_blank")
                }
              }
            />
          </Tooltip>
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        minHeight: 200,
        maxHeight: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
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
          toolbar: EditToolbar as GridSlots['toolbar'],
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
    </Box>
  );
}