import { useSelector } from "react-redux"
import { Navigate, Outlet, useNavigate } from "react-router-dom"

const RequireAuth=({allowedRoles})=>{
   const {role,isLoggedIn}=useSelector((store)=>store.auth)
   console.log(role);
   const navigate=useNavigate()
   return isLoggedIn && allowedRoles.find((myRole) => myRole == role) ? (
    <Outlet/>
) : isLoggedIn ? ( <Navigate to="/denied"/>) : (<Navigate to="login" />)
   
}
export default RequireAuth