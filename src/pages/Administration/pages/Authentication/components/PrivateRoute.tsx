import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../../../../../shared/hooks.ts"
import { signInPath } from "../shared/signInRedirect.ts"

export default function PrivateRoute() {
  const { user } = useAuth()
  const location = useLocation()

  return user ? <Outlet /> : <Navigate to={signInPath(location)} />
}
