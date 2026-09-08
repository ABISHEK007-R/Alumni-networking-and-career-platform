import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const location = useLocation();
  const token = localStorage.getItem("authToken");
  const storedUser = localStorage.getItem("currentUser") || localStorage.getItem("alumniUser");
  let user = null;
  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem("authToken");
    localStorage.removeItem("alumniUser");
    localStorage.removeItem("currentUser");
  }

  if (!token || !user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === "ALUMNI" ? "/alumni/dashboard" : "/student/dashboard"} replace />;
  }

  return children;
};

export default ProtectedRoute;
