import { Typography } from "@mui/material"
import { parseDate } from "../../../../../shared/Functions.tsx"
import { EventModel } from "../../../../../shared/EntityTypes.ts"
import Button from "@mui/material/Button"
import { useNavigate } from "react-router-dom"

interface Props {
  event: EventModel
}

export default function NoTodayEventButton(props: Props) {
  const navigate = useNavigate()

  const styles = {
    titleEvents: {
      color: "black",
      textAlign: "left",
      textTransform: "none",
      marginTop: "6px",
      overflow: "hidden", //,          // Clip overflowing text
      //whiteSpace: 'nowrap',        // Prevent line wrapping
      //textOverflow: 'ellipsis',    // Add ellipsis for overflow
    },
    clubNames: {
      color: "text.secondary",
      fontSize: "small",
    },
  }

  return (
    <Button
      key={props.event.id}
      sx={{
        backgroundColor: "#EEEDED",
        width: "45%",
        height: "120px",
        padding: "12px",
        marginBottom: "24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
      onClick={() => navigate(`/competitions/${props.event.id}`)}
    >
      <Typography color={"primary.main"}>{parseDate(props.event.initial_date)}</Typography>
      <Typography sx={styles.titleEvents}>{props.event.description}</Typography>
      {props.event.organizer ? (
        <Typography sx={styles.clubNames}>{props.event.organizer.name}</Typography>
      ) : (
        <></>
      )}
    </Button>
  )
}
