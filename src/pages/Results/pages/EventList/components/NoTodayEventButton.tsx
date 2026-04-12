import { Box, Typography } from "@mui/material"
import { parseDate } from "../../../../../shared/Functions.tsx"
import { EventModel } from "../../../../../shared/EntityTypes.ts"
import Button from "@mui/material/Button"
import { useNavigate } from "react-router-dom"
import CountryFlag from "../../../../../components/CountryFlag"

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
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    },
    clubNames: {
      color: "text.secondary",
      fontSize: "small",
      overflow: "hidden",
      textOverflow: "ellipsis",
      textAlign: "left",
      whiteSpace: "nowrap",
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
        transition: "transform 0.2s, box-shadow 0.2s",
        transformOrigin: "center", // Scale from the center without shifting position
        "&:hover": {
          transform: "scale(1.05)", // Slightly scale up on hover
        },
      }}
      onClick={() => void navigate(`/competitions/${props.event.id}`)}
    >
      <Typography color={"primary.main"}>{parseDate(props.event.initial_date)}</Typography>
      <Typography sx={styles.titleEvents}>{props.event.description}</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          gap: "4px",
          alignItems: "center",
          justifyContent: "flex-start",
          overflow: "hidden",
        }}
      >
        {props.event.country_code ? (
          <CountryFlag
            code={props.event.country_code.toLowerCase()}
            slotProps={{ image: { width: "14px" } }}
          />
        ) : null}
        {props.event.organizer ? (
          <Typography sx={styles.clubNames}>{props.event.organizer.name}</Typography>
        ) : (
          <></>
        )}
      </Box>
    </Button>
  )
}
