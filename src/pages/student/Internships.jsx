import { useEffect, useState } from "react";
import api from "../../api/client";
import DashboardLayout from "./DashboardLayout";

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInternships = async () => {
      try {
        setLoading(true);
        const response = await api.get("/internships");
        setInternships(response.data || []);
        setError("");
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load internships right now.");
      } finally {
        setLoading(false);
      }
    };

    loadInternships();
  }, []);

  return (
    <DashboardLayout title="Internships" eyebrow="Opportunities">
      <section className="page-intro directory-intro">
        <p className="section-kicker">Opportunities</p>
        <h2>Internships</h2>
        <p>Explore roles suited to your skills, location, and career goals.</p>
      </section>

      {error && <div className="directory-alert error">{error}</div>}

      {loading ? (
        <div className="directory-state">Loading internships...</div>
      ) : internships.length === 0 ? (
        <div className="directory-state">No internships are available right now.</div>
      ) : (
        <div className="directory-grid">
          {internships.map((internship) => (
            <article className="directory-card" key={internship.id}>
              <div className="directory-card-header">
                <div className="directory-avatar">{(internship.company || "I").slice(0, 2).toUpperCase()}</div>
                <div>
                  <h3>{internship.role}</h3>
                  <p>{internship.company}</p>
                </div>
              </div>

              <div className="directory-meta">
                <div>
                  <span className="directory-label">Location</span>
                  <strong>{internship.location}</strong>
                </div>
                <div>
                  <span className="directory-label">Apply</span>
                  <strong>{internship.applyLink ? "Link available" : "N/A"}</strong>
                </div>
              </div>

              <div className="directory-skill-list">
                <span className="directory-skill-tag">{internship.location}</span>
              </div>

              <div className="directory-footer">
                <span>{internship.description || "Apply now to explore the role."}</span>
                <button type="button" onClick={() => window.open(internship.applyLink || "#", "_blank", "noopener,noreferrer")}>Apply</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Internships;
