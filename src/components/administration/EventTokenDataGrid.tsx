import React, { useState } from "react";
import {useAuth} from "../../shared/hooks.ts";
import Button from "@mui/material/Button";
import {invalidateEventToken, postEventToken} from "../../services/EventService.ts";

interface Props {
  event_id : string,
}

export default function EventTokenDataGrid( props:Props ) {
  const {token} = useAuth()
  const [text, setText] = useState<string>('')

  return (
    <div>
      <div><b>{text}</b></div>
      <Button
        onClick={async ()=>{
          const res = await postEventToken(props.event_id,token as string)
          const newText = 'Copy your token here (it will not be displayed again): ' + res.data.token
          setText(newText)
          console.log(newText) // TODO remove console log and improve UI
        }
        }
      >
        Create Event Token
      </Button>
      <Button
        onClick={async ()=>{
          console.log( await invalidateEventToken(props.event_id,"",token as string) )
        }}
      >
        Delete Event Token (paste token in code)
      </Button>
    </div>
  )
}