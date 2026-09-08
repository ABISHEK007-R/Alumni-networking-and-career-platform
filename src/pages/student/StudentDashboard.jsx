import { useEffect, useMemo, useState } from "react";
import api from "../../api/client";
import useAuthUser from "../../hooks/useAuthUser";
import useDashboardData from "../../hooks/useDashboardData";
import DashboardLayout from "./DashboardLayout";

const StudentDashboard = () => {
  const { user, loading: userLoading } = useAuthUser();
  const { summary, loading: summaryLoading, error: summaryError } = useDashboardData();
  const [goal, setGoal] = useState("");
  const [activeGoal, setActiveGoal] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [notice, setNotice] = useState("");
  const [alumni, setAlumni] = useState([]);
  const [internships, setInternships] = useState([]);
  const [careerPath, setCareerPath] = useState({ currentSkills: [], recommendedSkills: [], nextStep: "" });
  const [connectionState, setConnectionState] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [alumniResponse, internshipsResponse, careerResponse] = await Promise.all([
          api.get("/alumni"),
          api.get("/internships"),
          api.get("/career-path"),
        ]);

        setAlumni(alumniResponse.data || []);
        setInternships(internshipsResponse.data || []);
        setCareerPath(careerResponse.data || { currentSkills: [], recommendedSkills: [], nextStep: "" });
        const connectionsResponse = await api.get("/connections/me");
        const statuses = {};
        (connectionsResponse.data || []).forEach((connection) => {
          const otherId = String(connection.senderId) === String(user?.id) ? connection.receiverId : connection.senderId;
          if (otherId) statuses[otherId] = connection.status;
        });
        setConnectionState(statuses);
        setError("");
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id]);

  const visibleAlumni = useMemo(() => {
    const query = (searchTerm.trim() || activeGoal).toLowerCase();
    if (!query) return alumni;
    return alumni.filter((person) => `${person.name} ${person.role} ${person.company} ${person.skills} ${person.location}`.toLowerCase().includes(query));
  }, [activeGoal, alumni, searchTerm]);

  const visibleInternships = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return internships;
    return internships.filter((internship) => `${internship.role} ${internship.company} ${internship.location} ${internship.description}`.toLowerCase().includes(query));
  }, [internships, searchTerm]);

  const handleSearch = () => {
    const nextGoal = goal.trim();
    setActiveGoal(nextGoal);
    setNotice(nextGoal ? `Showing alumni matches for ${nextGoal}.` : "Enter a career goal to find alumni matches.");
  };

  const handleConnect = async (person) => {
    try {
      const response = await api.post(`/connections/request/${person.id}`);
      setConnectionState((current) => ({ ...current, [person.id]: response.data?.status || "PENDING" }));
    } catch (requestError) {
      setNotice(requestError.response?.data?.message || "Connection request could not be sent.");
    }
  };

  const userName = user?.name || "";
  const statItems = [
    { value: summary.alumniCount || 0, label: "Alumni Matches" },
    { value: summary.mentorCount || 0, label: "Mentors" },
    { value: summary.internshipCount || 0, label: "Internships" },
    { value: summary.referralCount || 0, label: "Referrals" },
  ];

  return (
    <DashboardLayout title={userName ? `Welcome back, ${userName}` : "Welcome back"} eyebrow="Student workspace" searchTerm={searchTerm} onSearchChange={(event) => setSearchTerm(event.target.value)}>
      <section className="career-section hero-panel">
        <div>
          <p className="section-kicker">AI career companion</p>
          <h2>Shape your next career move</h2>
          <p>Tell us where you want to go and we will connect you with people who have already made the journey.</p>
        </div>
        <div className="search-box">
          <input type="text" placeholder="e.g. Cybersecurity Analyst" value={goal} onChange={(event) => setGoal(event.target.value)} onKeyDown={(event) => event.key === "Enter" && handleSearch()} />
          <button onClick={handleSearch}>Find Alumni <span>→</span></button>
        </div>
      </section>

      {notice && <p className="notice" role="status">{notice}</p>}
      {summaryError && <p className="error-banner" role="alert">{summaryError}</p>}
      {error && <p className="error-banner" role="alert">{error}</p>}

      {summaryLoading || userLoading ? (
        <div className="directory-state">Loading your dashboard...</div>
      ) : (
        <>
          <section className="stats-grid" aria-label="Your statistics">
            {statItems.map(({ value, label }) => (
              <article className="stat-card" key={label}>
                <div className="stat-icon">✦</div>
                <div>
                  <strong>{value}</strong>
                  <p>{label}</p>
                </div>
              </article>
            ))}
          </section>

          <section className="content-section">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Your network</p>
                <h2>Recommended Alumni</h2>
              </div>
            </div>

            {loading ? (
              <div className="directory-state">Loading alumni recommendations...</div>
            ) : visibleAlumni.length ? (
              <div className="alumni-grid">
                {visibleAlumni.map((person, index) => (
                  <article className="alumni-card" key={person.id || `${person.name}-${index}`}>
                    <div className={`person-avatar ${["blue", "orange", "green"][index % 3]}`}>{(person.name || "A").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</div>
                    <div className="person-info">
                      <h3>{person.name}</h3>
                      <p>{person.role || "Alumni"}</p>
                      <span>{person.company || "Career profile"}</span>
                    </div>
                    <div className="match-score"><span>Recommended</span></div>
                    <button className="connect-btn" disabled={connectionState[person.id] === "PENDING" || connectionState[person.id] === "ACCEPTED"} onClick={() => handleConnect(person)}>{connectionState[person.id] === "PENDING" ? "Requested" : connectionState[person.id] === "ACCEPTED" ? "Connected" : "Connect"}</button>
                  </article>
                ))}
              </div>
            ) : (
              <p className="empty-state">No alumni match that search yet.</p>
            )}
          </section>

          <div className="lower-grid">
            <section className="content-section">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">Opportunities</p>
                  <h2>Recommended Internships</h2>
                </div>
              </div>

              {loading ? (
                <div className="directory-state">Loading internships...</div>
              ) : visibleInternships.length ? (
                <div className="internship-grid">
                  {visibleInternships.map((internship) => (
                    <article className="internship-card" key={internship.id || internship.role}>
                      <div className="company-mark">{(internship.company || "A").slice(0, 1).toUpperCase()}</div>
                      <div>
                        <h3>{internship.role}</h3>
                        <p>{internship.company} <span>·</span> {internship.location}</p>
                      </div>
                      <button onClick={() => window.open(internship.applyLink || "#", "_blank", "noopener,noreferrer")}>Apply</button>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No internships match that search yet.</p>
              )}
            </section>

            <section className="career-path">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">AI recommendation</p>
                  <h2>Career Path</h2>
                </div>
                <span className="ai-badge">AI</span>
              </div>

              <div className="skill-group">
                <div className="skill-label">
                  <span>Current skills</span>
                  <b>{careerPath.currentSkills?.length || 0}</b>
                </div>
                <div className="progress"><span className="progress-current" /></div>
                <div className="tag-list">
                  {(careerPath.currentSkills || []).slice(0, 5).map((skill) => <span key={skill}>{skill}</span>)}
                </div>
              </div>

              <div className="skill-group">
                <div className="skill-label">
                  <span>Recommended next skills</span>
                  <b>Next up</b>
                </div>
                <div className="tag-list pale">
                  {(careerPath.recommendedSkills || []).slice(0, 5).map((skill) => <span key={skill}>{skill}</span>)}
                </div>
              </div>

              <div className="path-next">
                <span>↗</span>
                <div>
                  <b>Recommended next step</b>
                  <p>{careerPath.nextStep || "Keep growing your skills and build a portfolio project."}</p>
                </div>
              </div>
            </section>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default StudentDashboard;
