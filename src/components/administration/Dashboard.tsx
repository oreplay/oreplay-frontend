import {Container, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {GridColDef, DataGrid, GridRowParams} from '@mui/x-data-grid';
import {useEffect, useState} from "react";
import {getEventsFromUser} from "../../services/EventService.ts";
import {useAuth} from "../../shared/hooks.ts";
import {UserModel} from "../../shared/EntityTypes.ts";
import {useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';


interface EventDataGridColumns {
  id:string
  startDate:string,
  endDate:string,
  Name:string,
}


export function Dashboard() {
  const {t} = useTranslation()
  const {user,token,logoutAction} = useAuth()
  const [isLoading,setIsLoading] = useState<boolean>(true)
  const rowsPerPage = 5;
  const [totalRows,setTotalRows] = useState<number>(0)
  const [page,setPage] = useState<number>(0)
  const navigate = useNavigate()

  function handleClick (params:GridRowParams) {
    navigate(`/admin/${params.id}`)
  }

  const [rows,setRows] = useState<EventDataGridColumns[]>([])
  useEffect(()=>{
    const response = getEventsFromUser((user as UserModel).id,token as string,page+1,rowsPerPage)
    response.then((response)=>{
      setRows(
        response.data.map((event):EventDataGridColumns=> (
            {id:event.id, startDate:event.initial_date,endDate:event.final_date,Name:event.description}
          )
        )
      )
      setTotalRows(response.total)
      setIsLoading(false)
    })
    return ()=> setIsLoading(true)
  },[page,user,token])

  const columns :GridColDef[] = [
    {field:'startDate',headerName:t('Dashboard.StartDate'),width:150},
    {field:'endDate',headerName:t('Dashboard.FinishDate'),width:150},
    {field:'Name',headerName:t('Dashboard.Name'),width:150}
  ]

  return  (
    <Container>
      <Typography variant="h1" color="primary.main">{t('Dashboard.YourEvents')}</Typography>
      <Button
        onClick={() =>navigate('/admin/create-event')}
        variant="contained"
      > <AddIcon /> </Button>
      <DataGrid
        columns={columns}
        loading={isLoading}
        rows={rows}
        rowCount={totalRows}
        paginationMode={'server'}
        paginationModel={{page:page,pageSize:rowsPerPage}}
        onPaginationModelChange={(model)=>{setPage(model.page)}}
        onRowClick={handleClick}
      />
      <Button onClick={logoutAction}>Logout</Button>{/** TODO: move to the navigation var */}
    </Container>
  )
}