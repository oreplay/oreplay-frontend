import {useAuth} from "../../shared/hooks.ts";
import Button from "@mui/material/Button";
import {invalidateEventToken, postEventToken} from "../../services/EventService.ts";

interface Props {
  event_id : string,
}

export default function EventTokenDataGrid( props:Props ) {
  const {token} = useAuth()

  return (
    <>
      <Button
        onClick={()=>{
            console.log( postEventToken(props.event_id,token as string) )
          }
        }
      >
        Create Event Token
      </Button>
      <Button
        onClick={()=>{
          console.log( invalidateEventToken(props.event_id,"",token as string) )
        }}
      >
        Delete Event Token (paste token in code)
      </Button>
    </>

  )
}