import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../../services/UsersService.ts";

export default function PrivateRoute() {
  const {user} = useAuth()

  return user ?  <Outlet /> : <Navigate to={`/signin`}/>
}