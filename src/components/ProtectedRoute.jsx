import { Navigate, useLocation } from "react-router-dom";
import { clearAuthStorage } from "../auth/storage";

const ProtectedRoute = ({ children, requiredRole }) => {
  const location = useLocation();
  const token = localStorage.getItem("authToken");
  const storedUser = localStorage.getItem("currentUser") || localStorage.getItem("alumniUser");
  let user = null;
  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    clearAuthStorage();
  }

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === "ALUMNI" ? "/alumni/dashboard" : "/dashboard"} replace />;
  }

  return children;
};

export default ProtectedRoute;
