import { Box, Container, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import Button from "@mui/material/Button"
import AddIcon from "@mui/icons-material/Add"
import EventsDataGrid from "./components/EventsDataGrid"

export default function Dashboard() {
  const { t } = useTranslation()
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

  return (
    <Box sx={{ height: "100%" }}>
      <Container>
        <Typography variant="h1" color="primary.main">
          {t("Dashboard.YourEvents")}
        </Typography>
        <Typography component={"p"} variant={"body2"} color="text.secondary" sx={{ mb: 4 }}>
          {t("Dashboard.YourEvents.description")}
        </Typography>
        <Container sx={{ p: 4, borderRadius: 3, backgroundColor: "white" }}>
          <Box sx={{ mb: "10px" }}>
            <Button onClick={() => void navigate("/admin/create-event")} variant="contained">
              <AddIcon />
            </Button>
            <EventsDataGrid />
          </Box>
        </Container>
      </Container>
    </Box>
  )
}
