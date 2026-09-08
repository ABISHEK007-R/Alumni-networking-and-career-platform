import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AlumniDashboard from "./pages/AlumniDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import AlumniNetwork from "./pages/student/AlumniNetwork";
import Mentors from "./pages/student/Mentors";
import Internships from "./pages/student/Internships";
import CareerPath from "./pages/student/CareerPath";
import Messages from "./pages/student/Messages";
import Profile from "./pages/student/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

const protectedPage = (element, requiredRole) => (
  <ProtectedRoute requiredRole={requiredRole}>{element}</ProtectedRoute>
);

function App() {
  return (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student/dashboard" element={protectedPage(<StudentDashboard />, "STUDENT")} />
        <Route path="/student" element={protectedPage(<StudentDashboard />, "STUDENT")} />
        <Route path="/alumni/dashboard" element={protectedPage(<AlumniDashboard />, "ALUMNI")} />
        <Route path="/alumni" element={protectedPage(<AlumniDashboard />, "ALUMNI")} />
        <Route path="/student-dashboard" element={protectedPage(<StudentDashboard />, "STUDENT")} />
        <Route path="/alumni-network" element={protectedPage(<AlumniNetwork />, "STUDENT")} />
        <Route path="/mentors" element={protectedPage(<Mentors />, "STUDENT")} />
        <Route path="/internships" element={protectedPage(<Internships />, "STUDENT")} />
        <Route path="/career-path" element={protectedPage(<CareerPath />, "STUDENT")} />
        <Route path="/messages" element={protectedPage(<Messages />, "STUDENT")} />
        <Route path="/profile" element={protectedPage(<Profile />, "STUDENT")} />
    </Routes>
  );
}

export default App;