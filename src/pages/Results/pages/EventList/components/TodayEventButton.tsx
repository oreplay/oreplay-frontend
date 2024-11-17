import {Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {EventModel} from "../../../../../shared/EntityTypes.ts";
import Button from "@mui/material/Button";
import { Launch } from '@mui/icons-material'

interface TodayEventButtonProps {
  event: EventModel;
  index: number
}

export default function TodayEventButton(props:TodayEventButtonProps) {
  const navigate = useNavigate();

  const styles = {
    typographyBox: {
      color: "white",
      margin: "12px",
      textAlign: "left",
      textTransform: 'none'
    }
  }

  return (
    <Button
      key={props.event.id}
      sx={{
        borderRadius:"6px",
        display:"flex",
        flexDirection:"column",
        justifyContent:"space-between",
        alignItems:'flex-start',
        backgroundColor: props.index%2 == 0 ? "primary.main": "secondary.main",
        minWidth:"220px",
        width:"220px",
        height:"160px",
        padding: "6px 8px",
        marginRight:"24px",
        transition: "transform 0.2s, box-shadow 0.2s, background-color 0.2s",
        transformOrigin: "center",  // Scale from the center without shifting position
        "&:hover": {
          backgroundColor: props.index % 2 === 0 ? "primary.main" : "secondary.main", //keep the color
          transform: "scale(1.05)",  // Slightly scale up on hover
        },
      }}
      variant="contained"
      endIcon={<Launch sx={{color: "white", position: "absolute", bottom:"12px", right:"16px"}}/>}
      onClick={() => navigate(`/competitions/${props.event.id}`)}
    >
      <Typography sx={styles.typographyBox} fontWeight={"bolder"}>
        {props.event.description}
      </Typography>
    </Button>
  )
}