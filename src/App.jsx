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
import StudentNetwork from "./pages/alumni/StudentNetwork";
import MentorshipRequests from "./pages/alumni/MentorshipRequests";
import InternshipPosts from "./pages/alumni/InternshipPosts";
import Referrals from "./pages/alumni/Referrals";
import AlumniDirectory from "./pages/AlumniDirectory";
import DashboardRedirect from "./pages/DashboardRedirect";
import AICareerAssistant from "./pages/AICareerAssistant";
import ProtectedRoute from "./components/ProtectedRoute";

const protectedPage = (element, requiredRole) => (
  <ProtectedRoute requiredRole={requiredRole}>{element}</ProtectedRoute>
);

function App() {
  return (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={protectedPage(<DashboardRedirect />)} />
        <Route path="/student/dashboard" element={protectedPage(<StudentDashboard />, "STUDENT")} />
        <Route path="/student" element={protectedPage(<StudentDashboard />, "STUDENT")} />
        <Route path="/alumni/dashboard" element={protectedPage(<AlumniDashboard />, "ALUMNI")} />
        <Route path="/alumni" element={protectedPage(<AlumniDashboard />, "ALUMNI")} />
        <Route path="/student-dashboard" element={protectedPage(<StudentDashboard />, "STUDENT")} />
        <Route path="/network" element={protectedPage(<AlumniNetwork />, "STUDENT")} />
        <Route path="/alumni-network" element={protectedPage(<AlumniNetwork />, "STUDENT")} />
        <Route path="/alumni-directory" element={protectedPage(<AlumniDirectory />, "STUDENT")} />
        <Route path="/mentors" element={protectedPage(<Mentors />, "STUDENT")} />
        <Route path="/internships" element={protectedPage(<Internships />, "STUDENT")} />
        <Route path="/career-path" element={protectedPage(<CareerPath />, "STUDENT")} />
        <Route path="/messages" element={protectedPage(<Messages />)} />
        <Route path="/profile" element={protectedPage(<Profile />)} />
        <Route path="/ai-assistant" element={protectedPage(<AICareerAssistant />)} />
        <Route path="/student-network" element={protectedPage(<StudentNetwork />, "ALUMNI")} />
        <Route path="/mentorship-requests" element={protectedPage(<MentorshipRequests />, "ALUMNI")} />
        <Route path="/internship-posts" element={protectedPage(<InternshipPosts />, "ALUMNI")} />
        <Route path="/referrals" element={protectedPage(<Referrals />, "ALUMNI")} />
    </Routes>
  );
}

export default App;