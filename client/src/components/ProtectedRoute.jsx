import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles, redirectPath = "/manager-login" }) {
  const user = JSON.parse(sessionStorage.getItem("user")); 

  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
