import { useEffect, useState } from "react";
import api from "../../api/client";
import DashboardLayout from "./DashboardLayout";

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requested, setRequested] = useState({});

  const requestMentorship = async (mentor) => {
    const payload = { mentorId: mentor.userId };
    console.log("Mentorship request payload:", payload);
    try {
      const response = await api.post("/mentorship-requests", payload);
      console.log("Mentorship request response:", response.status, response.data);
      setRequested((current) => ({ ...current, [mentor.userId]: true }));
    } catch (requestError) {
      console.error("Mentorship request error:", {
        url: requestError.config?.baseURL && requestError.config?.url
          ? `${requestError.config.baseURL}${requestError.config.url}`
          : requestError.config?.url,
        payload,
        status: requestError.response?.status,
        response: requestError.response?.data,
        message: requestError.message,
      });
      setError(requestError.response?.data?.message || "Unable to request mentorship.");
    }
  };

  useEffect(() => {
    const loadMentors = async () => {
      try {
        setLoading(true);
        const response = await api.get("/mentors");
        setMentors(response.data || []);
        setError("");
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load mentors right now.");
      } finally {
        setLoading(false);
      }
    };

    loadMentors();
  }, []);

  return (
    <DashboardLayout title="Mentors" eyebrow="Guidance">
      <section className="page-intro directory-intro">
        <p className="section-kicker">Guidance</p>
        <h2>Mentors</h2>
        <p>Find experienced professionals who can support your career journey.</p>
      </section>

      {error && <div className="directory-alert error">{error}</div>}

      {loading ? (
        <div className="directory-state">Loading mentors...</div>
      ) : mentors.length === 0 ? (
        <div className="directory-state">No mentors available right now.</div>
      ) : (
        <div className="directory-grid">
          {mentors.map((mentor) => (
            <article className="directory-card" key={mentor.id}>
              <div className="directory-card-header">
                <div className="directory-avatar">{(mentor.name || "M").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</div>
                <div>
                  <h3>{mentor.name}</h3>
                  <p>{mentor.domain}</p>
                </div>
              </div>

              <div className="directory-meta">
                <div>
                  <span className="directory-label">Company</span>
                  <strong>{mentor.company}</strong>
                </div>
                <div>
                  <span className="directory-label">Experience</span>
                  <strong>{mentor.experienceYears} years</strong>
                </div>
              </div>

              <div className="directory-skill-list">
                <span className="directory-skill-tag">{mentor.domain}</span>
              </div>

              <div className="directory-footer">
                <span>{mentor.bio || "Ready to guide the next step."}</span>
                <button type="button" onClick={() => requestMentorship(mentor)} disabled={!mentor.userId || Boolean(requested[mentor.userId])}>{requested[mentor.userId] ? "Requested" : "Request mentorship"}</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Mentors;
