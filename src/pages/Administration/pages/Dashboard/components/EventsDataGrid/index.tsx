import { useTranslation } from "react-i18next"
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid"
import Tooltip from "@mui/material/Tooltip"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { useQuery } from "react-query"
import { EventModel, UserModel } from "../../../../../../shared/EntityTypes.ts"
import { getEventsFromUser } from "../../../../services/EventAdminService.ts"
import { useAuth } from "../../../../../../shared/hooks.ts"
import { useCallback, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import EventsDataGridToolbar from "./components/EventsDataGridToolbar"

const ROWS_PER_PAGE = 15

interface EventDataGridColumns {
  id: string
  startDate: string
  endDate: string
  name: string
  isHidden: boolean
}

export default function EventsDataGrid() {
  const { t } = useTranslation()
  const { user, token } = useAuth()
  const navigate = useNavigate()

  // Pagination controller
  const [page, setPage] = useState<number>(0)

  // Query
  const thisUserEventsQuery = useQuery(
    ["events", "byUser", user!.id, page],
    () => getEventsFromUser((user as UserModel).id, token as string, page + 1, ROWS_PER_PAGE),
    {
      staleTime: 60000,
      keepPreviousData: true,
    },
  )

  const rowArray = useMemo(() => {
    if (!thisUserEventsQuery.isSuccess) return []

    return thisUserEventsQuery.data.data.map(
      (event: EventModel): EventDataGridColumns => ({
        id: event.id,
        startDate: event.initial_date,
        endDate: event.final_date,
        name: event.description,
        isHidden: event.is_hidden,
      }),
    )
  }, [thisUserEventsQuery.isSuccess, thisUserEventsQuery.data])

  // Table definition
  const columns: GridColDef[] = [
    { field: "startDate", headerName: t("Dashboard.StartDate"), width: 150 },
    { field: "endDate", headerName: t("Dashboard.FinishDate"), width: 130 },
    { field: "name", headerName: t("Dashboard.Name"), flex: 1, minWidth: 200 },
    {
      field: "visibility",
      headerName: "",
      width: 20,
      renderCell: (params) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (params.row.isHidden) {
          return (
            <Tooltip title={t("EventAdmin.Hidden")}>
              <VisibilityOffIcon color={"disabled"} />
            </Tooltip>
          )
        } else {
          return (
            <Tooltip title={t("EventAdmin.Public")}>
              <VisibilityIcon color={"action"} />
            </Tooltip>
          )
        }
      },
    },
  ]

  const handleClick = useCallback(
    (params: GridRowParams) => void navigate(`/admin/${params.id}`),
    [navigate],
  )

  // Actual component
  return (
    <DataGrid
      columns={columns}
      loading={thisUserEventsQuery.isLoading}
      rows={rowArray}
      rowCount={thisUserEventsQuery.data?.total}
      paginationMode={"server"}
      paginationModel={{ page: page, pageSize: ROWS_PER_PAGE }}
      onPaginationModelChange={(model) => {
        setPage(model.page)
      }}
      onRowClick={handleClick}
      slots={{
        toolbar: EventsDataGridToolbar,
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
  )
}
