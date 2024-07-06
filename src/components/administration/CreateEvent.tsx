import EventAdminForm from "./EventAdminForm.tsx";
import React from "react";
import {useAuth} from "../../shared/hooks.ts";
import {postEvent} from "../../services/EventService.ts";
import {DateTime} from "luxon";

export default function CreateEvent (){
  const {token} = useAuth() as {token: string};

  const handleSubmit = (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const response = postEvent(
      data.get('description') as string,
      DateTime.fromFormat(data.get('startDate') as string,'dd/mm/yyyy').toSQLDate() as string,
      DateTime.fromFormat(data.get('startDate') as string,'dd/mm/yyyy').toSQLDate() as string,
      data.get('endDate') as string,
      token
    )
    console.log(response)
    console.log(data)

  }

  return (
    <EventAdminForm
      canEdit
      handleSubmit={handleSubmit}
    />
  )
}