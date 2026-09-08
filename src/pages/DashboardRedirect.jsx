import { Navigate } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import StudentDashboard from "./student/StudentDashboard";

const DashboardRedirect = () => {
  const { user, loading } = useAuthUser();

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return user?.role === "ALUMNI" ? <Navigate to="/alumni/dashboard" replace /> : <StudentDashboard />;
};

export default DashboardRedirect;
