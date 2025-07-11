import { Box, Container, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { GridColDef, DataGrid, GridRowParams } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import { getEventsFromUser } from "../../services/EventAdminService.ts"
import { useNavigate } from "react-router-dom"
import Button from "@mui/material/Button"
import AddIcon from "@mui/icons-material/Add"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import { EventModel, UserModel } from "../../../../shared/EntityTypes.ts"
import { useAuth } from "../../../../shared/hooks.ts"

interface EventDataGridColumns {
  id: string
  startDate: string
  endDate: string
  name: string
  isHidden: boolean
}

export default function Dashboard() {
  const { t } = useTranslation()
  const { user, token } = useAuth()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const rowsPerPage = 15
  const [totalRows, setTotalRows] = useState<number>(0)
  const [page, setPage] = useState<number>(0)
  const navigate = useNavigate()

  function handleClick(params: GridRowParams) {
    void navigate(`/admin/${params.id}`)
  }

  const [rows, setRows] = useState<EventDataGridColumns[]>([])
  useEffect(() => {
    const response = getEventsFromUser(
      (user as UserModel).id,
      token as string,
      page + 1,
      rowsPerPage,
    )
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    response.then((response) => {
      setRows(
        response.data.map(
          (event: EventModel): EventDataGridColumns => ({
            id: event.id,
            startDate: event.initial_date,
            endDate: event.final_date,
            name: event.description,
            isHidden: event.is_hidden,
          }),
        ),
      )
      setTotalRows(response.total)
      setIsLoading(false)
    })
    return () => setIsLoading(true)
  }, [page, user, token])

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
          return <VisibilityOffIcon color={"disabled"} />
        } else {
          return <VisibilityIcon color={"action"} />
        }
      },
    },
  ]

  return (
    <Box sx={{ height: "100%" }}>
      <Container>
        <Typography variant="h1" color="primary.main">
          {t("Dashboard.YourEvents")}
        </Typography>
        <Box sx={{ mb: "10px" }}>
          <Button onClick={() => void navigate("/admin/create-event")} variant="contained">
            <AddIcon />
          </Button>
        </Box>
        <DataGrid
          columns={columns}
          loading={isLoading}
          rows={rows}
          rowCount={totalRows}
          paginationMode={"server"}
          paginationModel={{ page: page, pageSize: rowsPerPage }}
          onPaginationModelChange={(model) => {
            setPage(model.page)
          }}
          onRowClick={handleClick}
        />
      </Container>
    </Box>
  )
}
