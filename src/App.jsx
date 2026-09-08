import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/student/StudentDashboard";
import AlumniNetwork from "./pages/student/AlumniNetwork";
import Mentors from "./pages/student/Mentors";
import Internships from "./pages/student/Internships";
import CareerPath from "./pages/student/CareerPath";
import Messages from "./pages/student/Messages";
import Profile from "./pages/student/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/alumni-network" element={<AlumniNetwork />} />
        <Route path="/mentors" element={<Mentors />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/career-path" element={<CareerPath />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;