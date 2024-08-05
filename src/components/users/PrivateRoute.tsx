import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../../shared/hooks.ts";

export default function PrivateRoute() {
  const {user} = useAuth()

  return user ?  <Outlet /> : <Navigate to={`/signin`}/>
}