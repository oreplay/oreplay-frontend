import { Box, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { EventModel } from "../../../../../shared/EntityTypes.ts"
import Button from "@mui/material/Button"
import { Launch } from "@mui/icons-material"
import CountryFlag from "../../../../../components/CountryFlag"

interface TodayEventButtonProps {
  event: EventModel
  index: number
}

export default function TodayEventButton(props: TodayEventButtonProps) {
  const navigate = useNavigate()

  const styles = {
    typographyBoxEventName: {
      color: "white",
      textAlign: "left",
      textTransform: "none",
    },
    typographyBoxOrganizerName: {
      color: "white",
      textAlign: "left",
      textTransform: "none",
      fontSize: "small",
    },
  }

  return (
    <Button
      key={props.event.id}
      sx={{
        borderRadius: "6px",
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        backgroundColor: props.index % 2 == 0 ? "primary.main" : "secondary.main",
        minWidth: "220px",
        width: "220px",
        height: "160px",
        padding: "16px 16px",
        marginRight: "24px",
        transition: "transform 0.2s, box-shadow 0.2s, background-color 0.2s",
        transformOrigin: "center", // Scale from the center without shifting position
        "&:hover": {
          backgroundColor: props.index % 2 === 0 ? "primary.main" : "secondary.main", //keep the color
          transform: "scale(1.05)", // Slightly scale up on hover
        },
      }}
      variant="contained"
      endIcon={
        <Launch sx={{ color: "white", position: "absolute", bottom: "12px", right: "16px" }} />
      }
      onClick={() => void navigate(`/competitions/${props.event.id}`)}
    >
      <Typography component={"span"} sx={styles.typographyBoxEventName} fontWeight={"bolder"}>
        {props.event.description}
      </Typography>
      {props.event.organizer ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            gap: "4px",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {props.event.country_code ? (
            <CountryFlag
              code={props.event.country_code.toLowerCase()}
              slotProps={{ image: { width: "14px" } }}
            />
          ) : null}
          <Typography component={"span"} sx={styles.typographyBoxOrganizerName}>
            {props.event.organizer.name}
          </Typography>
        </Box>
      ) : null}
    </Button>
  )
}
