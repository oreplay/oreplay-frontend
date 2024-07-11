import EventAdminForm from "./EventAdminForm.tsx";
import React from "react";
import {useAuth} from "../../shared/hooks.ts";
import {postEvent} from "../../services/EventService.ts";
import {DateTime} from "luxon";
import {useNavigate} from "react-router-dom";

export default function CreateEvent (){
  const {token} = useAuth() as {token: string};
  const navigate = useNavigate()

  const handleSubmit = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const response = postEvent(
      data.get('description') as string,
      DateTime.fromFormat(data.get('startDate') as string,'dd/mm/yyyy').toSQLDate() as string,
      DateTime.fromFormat(data.get('endDate') as string,'dd/mm/yyyy').toSQLDate() as string,
      token
    )
    console.log(response)
    console.log(data)
    response.then(
      (response) => {
        navigate(`/admin/${response.data.id}`)
      }
    ,
      ()=>console.log("Create event failed",response)
    )
  }

  return (
    <EventAdminForm
      canEdit
      handleSubmit={handleSubmit}
    />
  )
}