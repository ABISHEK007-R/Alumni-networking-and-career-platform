import { useEffect, useState } from "react";
import api from "../../api/client";
import DashboardLayout from "../student/DashboardLayout";

const StudentNetwork = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api.get("/users/network/students")
      .then((response) => setStudents(response.data || []))
      .catch((requestError) => setError(requestError.response?.data?.message || "Unable to load students."));
  }, []);
  return <DashboardLayout title="Student Network" eyebrow="Alumni workspace"><section className="page-intro directory-intro"><p className="section-kicker">Community</p><h2>Student Network</h2><p>Students connected to the alumni community.</p></section>{error && <div className="directory-alert error">{error}</div>}<div className="directory-grid">{students.length ? students.map((student) => <article className="directory-card" key={student.id}><div className="directory-card-header"><div className="directory-avatar">{(student.name || "S").slice(0, 2).toUpperCase()}</div><div><h3>{student.name}</h3><p>{student.college || "College not shared"}</p></div></div><div className="directory-meta"><div><span className="directory-label">Location</span><strong>{student.location || "Not shared"}</strong></div><div><span className="directory-label">Skills</span><strong>{student.skills || "Not shared"}</strong></div></div></article>) : <div className="directory-state">No students found.</div>}</div></DashboardLayout>;
};
export default StudentNetwork;
