<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
=======
>>>>>>> 3682bba1e564d0138065dbeacb33a67207228b48

import StudentDashboard from "./pages/student/StudentDashboard";
function App() {
<<<<<<< HEAD
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
=======

    return <StudentDashboard />;
>>>>>>> 3682bba1e564d0138065dbeacb33a67207228b48
}

export default App;