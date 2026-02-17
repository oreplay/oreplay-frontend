import { IconButton, Toolbar } from "@mui/material"
import { useNavigate } from "react-router-dom"
import Tooltip from "@mui/material/Tooltip"
import AddIcon from "@mui/icons-material/Add"
import { useTranslation } from "react-i18next"

export default function EventsDataGridToolbar() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleClick = () => {
    void navigate("/admin/create-event")
  }

  return (
    <Toolbar
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        backgroundColor: "background.paper",
      }}
    >
      <Tooltip title={t("Dashboard.YourEvents.CreateEvent")}>
        <IconButton
          onClick={handleClick}
          sx={{
            backgroundColor: "transparent",
            borderRadius: Infinity,
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Toolbar>
  )
}
